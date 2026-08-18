import { useMemo, useState } from "react";
import { AlertTriangle, CreditCard, Lock } from "lucide-react";
import { authService, subscriptionService } from "../service";

const SubscriptionRequiredModal = ({ profile, allowPurchase = true, onActivated }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const user = profile?.data?.user || {};
  const subscription = profile?.data?.subscription || {};
  const plan = subscription?.plan || null;
  const ownerName = subscription?.adminName;

  const message = useMemo(() => {
    if (!allowPurchase) {
      return ownerName
        ? `Your organization's subscription is inactive. Please contact ${ownerName} to renew access.`
        : "Your organization's subscription is inactive. Please contact your admin to renew access.";
    }

    if (plan?.planType === "free_trial") {
      return "Your free trial has ended or the automatic charge failed. Purchase a subscription to continue using the dashboard.";
    }

    return "Your subscription is inactive or expired. Purchase a subscription to continue using the dashboard.";
  }, [allowPurchase, ownerName, plan?.planType]);

  const handlePurchase = async () => {
    setSubmitting(true);
    setError("");
    try {
      const orderResult = await subscriptionService.createOrder("starter_pack");
      if (!orderResult.success) {
        setError(orderResult.message || "Failed to start subscription purchase");
        setSubmitting(false);
        return;
      }

      const paymentResult = await subscriptionService.openCheckout(orderResult.data, user);
      if (!paymentResult.success) {
        setError(paymentResult.message || "Payment was not completed");
        setSubmitting(false);
        return;
      }

      const refreshed = await authService.getProfile();
      if (!refreshed.success) {
        setError("Subscription activated, but session refresh failed. Please reload.");
        setSubmitting(false);
        return;
      }

      onActivated?.(refreshed);
    } catch {
      setError("Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-red-50 p-3 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900">Subscription Required</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <Lock size={16} />
            Access paused
          </div>
          <p className="mt-2">
            Until the subscription is active, dashboard actions are blocked and the free trial cannot be started again.
          </p>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {allowPurchase ? (
            <button
              type="button"
              onClick={handlePurchase}
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:cursor-wait disabled:opacity-60"
            >
              <CreditCard size={16} />
              {submitting ? "Processing..." : "Purchase Starter Subscription"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => authService.logout().then(() => { window.location.href = "/auth"; })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRequiredModal;
