import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    Check,
    CheckCircle2,
    ChevronRight,
    CircleDollarSign,
    FileText,
    KeyRound,
    Loader2,
    Mail,
    MapPin,
    Pencil,
    Phone,
    ShieldCheck,
    Upload,
    UserRound,
    UsersRound,
    X,
} from 'lucide-react';
import { Toast } from '../../../../components/common/Toast';
import {
    authService,
    departmentService,
    designationService,
    employeeService,
    hiringService,
    subscriptionService,
} from '../../../../service';
import { isOrgAdmin } from '../../../../utils/authMode';

const DRAFT_KEY = 'addEmployeeWizardDraft';
const EMPLOYMENT_META_KEY = 'employeeEmploymentMeta';
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const splitAddressParts = (address = '') => {
    const parts = String(address)
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

    return {
        street: parts[0] || '',
        city: parts[1] || '',
        state: parts[2] || '',
        postalCode: parts[3] || '',
    };
};

const getStringId = (value) => (value === null || value === undefined ? '' : String(value));

const pickPrefill = (value, fallback = '') => {
    if (value === null || value === undefined || value === '') return fallback;
    return value;
};

const initialForm = {
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    profilePic: '',
    profilePicFile: null,
    employmentDepartmentId: '',
    employmentDepartmentName: '',
    employmentDesignationId: '',
    employmentJobTitle: '',
    employmentJoiningDate: '',
    employmentReportingManagerId: '',
    employmentReportingManagerName: '',
    employmentWorkLocation: '',
    employmentBranch: '',
    employmentContractType: 'Full-time',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    contactName: '',
    contactNumber: '',
    relation: '',
    ctc: '',
    currency: 'INR',
    paymentMode: 'bank_transfer',
    baseSalary: '',
    monthlyGross: '',
    monthlyPay: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    documents: [],
    password: '',
    confirmPassword: '',
    role: 'Employee',
    sendInvite: true,
    isAdmin: false,
};

const steps = [
    { title: 'Personal', subtitle: 'Basic identity', icon: UserRound },
    { title: 'Employment', subtitle: 'Role and workplace', icon: BriefcaseBusiness },
    { title: 'Contact', subtitle: 'Address and emergency', icon: MapPin },
    { title: 'Salary', subtitle: 'Compensation', icon: CircleDollarSign },
    { title: 'Documents', subtitle: 'Employee records', icon: FileText },
    { title: 'Account', subtitle: 'Access and permissions', icon: KeyRound },
    { title: 'Review', subtitle: 'Confirm and create', icon: ShieldCheck },
];

const requiredLabel = (label) => (
    <>
        {label} <span className="text-red-500">*</span>
    </>
);

const Field = ({ label, error, hint, children, className = '' }) => (
    <div className={className}>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
        {children}
        {error ? (
            <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
        ) : hint ? (
            <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
        ) : null}
    </div>
);

const SectionIntro = ({ eyebrow, title, description }) => (
    <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-600">{eyebrow}</p>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
);

const ReviewSection = ({ title, icon, onEdit, children }) => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    {React.createElement(icon, { size: 18 })}
                </span>
                <h3 className="font-bold text-slate-900">{title}</h3>
            </div>
            <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"
            >
                <Pencil size={14} /> Edit
            </button>
        </div>
        {children}
    </section>
);

const ReviewGrid = ({ items }) => (
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([label, value]) => (
            <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="mt-1 break-words text-sm font-medium text-slate-800">{value || '—'}</dd>
            </div>
        ))}
    </dl>
);

const AddEmployee = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isEditMode = searchParams.get('mode') === 'edit';
    const editEmployeeId = searchParams.get('id');
    const offerId = searchParams.get('offerId');
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [loadingEmployee, setLoadingEmployee] = useState(Boolean(isEditMode && editEmployeeId));
    const [editEmployee, setEditEmployee] = useState(null);
    const [originalEmail, setOriginalEmail] = useState('');
    const offerPrefillAppliedRef = useRef(null);
    const draftKey = isEditMode ? `${DRAFT_KEY}:${editEmployeeId || 'current'}` : DRAFT_KEY;

    const getCurrentUser = () => {
        try {
            return JSON.parse(localStorage.getItem('userData') || '{}');
        } catch {
            return {};
        }
    };

    const inputClass = (name) =>
        `h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
            errors[name]
                ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                : 'border-slate-200 hover:border-slate-300 focus:border-violet-500 focus:ring-violet-50'
        }`;

    useEffect(() => {
        if (!isOrgAdmin()) navigate('/hrms/employees', { replace: true });
    }, [navigate]);

    const loadOptions = useCallback(async () => {
        setLoadingOptions(true);
        const userData = getCurrentUser();
        const adminId = userData?.id || userData?._id;
        const [profileRes, departmentRes, designationRes, managerRes] = await Promise.all([
            authService.getProfile(),
            departmentService.getDepartmentsDropdown(),
            designationService.getDesignationDropdown(),
            adminId ? employeeService.getAllEmployeesByAdminId(adminId) : Promise.resolve({ success: true, data: [] }),
        ]);

        if (profileRes.success && profileRes.data?.plan) setSubscriptionInfo(profileRes.data.plan);
        if (departmentRes.success) setDepartments(departmentRes.data || []);
        if (designationRes.success) setDesignations(designationRes.data || []);
        if (managerRes.success) setManagers(Array.isArray(managerRes.data) ? managerRes.data : []);
        setLoadingOptions(false);
    }, []);

    useEffect(() => {
        if (isEditMode || offerId) return;
        const savedDraft = localStorage.getItem(draftKey);
        if (!savedDraft) return;
        try {
            const parsedDraft = JSON.parse(savedDraft);
            if (parsedDraft?.formData) {
                setFormData({
                    ...initialForm,
                    ...parsedDraft.formData,
                    profilePic: '',
                    profilePicFile: null,
                    documents: [],
                });
                setCurrentStep(Math.min(Number(parsedDraft.currentStep) || 0, steps.length - 1));
                setIsDirty(true);
                setToast({
                    type: 'success',
                    title: 'Draft restored',
                    message: 'Your saved employee details are ready to continue.',
                });
            }
        } catch {
            localStorage.removeItem(draftKey);
        }
    }, [draftKey, isEditMode, offerId]);

    useEffect(() => {
        loadOptions();
    }, [loadOptions]);

    useEffect(() => {
        if (isEditMode || !offerId || loadingOptions) return;
        if (offerPrefillAppliedRef.current === offerId) return;

        let isMounted = true;
        const loadOfferPrefill = async () => {
            localStorage.removeItem(draftKey);
            const result = await hiringService.getOfferOnboardingPrefill(Number(offerId));
            if (!isMounted || !result.success || !result.data) return;

            const prefill = result.data;
            const matchedDepartment = (departments || []).find(
                (item) => item.name?.toLowerCase() === String(prefill.employmentDepartmentName || '').toLowerCase(),
            );
            const matchedDesignation = (designations || []).find(
                (item) => item.title?.toLowerCase() === String(prefill.employmentJobTitle || '').toLowerCase()
                    || item.name?.toLowerCase() === String(prefill.employmentJobTitle || '').toLowerCase(),
            );

            setFormData((current) => ({
                ...initialForm,
                name: pickPrefill(prefill.name, current.name),
                email: pickPrefill(prefill.email, current.email),
                phone: pickPrefill(prefill.phone, current.phone),
                dob: pickPrefill(prefill.dob, current.dob),
                gender: pickPrefill(prefill.gender, current.gender),
                employmentJobTitle: pickPrefill(prefill.employmentJobTitle, current.employmentJobTitle),
                employmentDepartmentId: matchedDepartment ? String(matchedDepartment.id) : current.employmentDepartmentId,
                employmentDepartmentName: matchedDepartment?.name || pickPrefill(prefill.employmentDepartmentName, current.employmentDepartmentName),
                employmentDesignationId: matchedDesignation ? String(matchedDesignation.id) : current.employmentDesignationId,
                employmentJoiningDate: prefill.employmentJoiningDate
                    ? String(prefill.employmentJoiningDate).slice(0, 10)
                    : current.employmentJoiningDate,
                employmentWorkLocation: pickPrefill(prefill.employmentWorkLocation, current.employmentWorkLocation),
                address: pickPrefill(prefill.address, current.address),
                city: pickPrefill(prefill.city, current.city),
                state: pickPrefill(prefill.state, current.state),
                postalCode: pickPrefill(prefill.postalCode, current.postalCode),
                contactName: pickPrefill(prefill.contactName, current.contactName),
                contactNumber: pickPrefill(prefill.contactNumber, current.contactNumber),
                ctc: pickPrefill(prefill.ctc, current.ctc),
                monthlyGross: pickPrefill(prefill.monthlyGross, current.monthlyGross),
                monthlyPay: pickPrefill(prefill.monthlyPay, current.monthlyPay),
                baseSalary: pickPrefill(prefill.baseSalary, current.baseSalary),
                bankName: pickPrefill(prefill.bankName, current.bankName),
                accountNumber: pickPrefill(prefill.accountNumber, current.accountNumber),
                ifscCode: pickPrefill(prefill.ifscCode, current.ifscCode),
                profilePic: pickPrefill(prefill.profilePic, current.profilePic),
                documents: Array.isArray(prefill.documents) && prefill.documents.length
                    ? prefill.documents
                    : current.documents,
            }));
            offerPrefillAppliedRef.current = offerId;
            setIsDirty(true);
            setToast({
                type: 'success',
                title: 'Offer details loaded',
                message: 'Candidate onboarding details have been prefilled from the accepted offer and document submission.',
            });
        };

        loadOfferPrefill();
        return () => {
            isMounted = false;
        };
    }, [offerId, isEditMode, loadingOptions, draftKey]);

    useEffect(() => {
        if (!isEditMode) return;
        if (!editEmployeeId) {
            setToast({
                type: 'error',
                title: 'Missing employee id',
                message: 'Open edit mode from an employee record so the form can load the existing details.',
            });
            navigate('/hrms/employees', { replace: true });
            return;
        }

        let isMounted = true;

        const loadEmployee = async () => {
            setLoadingEmployee(true);
            try {
                const response = await employeeService.getUserById(editEmployeeId);
                if (!isMounted) return;

                if (response.success && response.data) {
                    setEditEmployee(response.data);
                    const user = response.data.user || response.data.employee?.user || response.data;
                    setOriginalEmail(String(user?.email || '').trim().toLowerCase());
                } else {
                    setToast({
                        type: 'error',
                        title: 'Employee not found',
                        message: response.message || 'Could not load employee details for editing.',
                    });
                    navigate('/hrms/employees', { replace: true });
                }
            } catch {
                if (!isMounted) return;
                setToast({
                    type: 'error',
                    title: 'Load failed',
                    message: 'Could not load employee details for editing.',
                });
                navigate('/hrms/employees', { replace: true });
            } finally {
                if (isMounted) setLoadingEmployee(false);
            }
        };

        loadEmployee();

        return () => {
            isMounted = false;
        };
    }, [editEmployeeId, isEditMode, navigate]);

    useEffect(() => {
        if (!isEditMode || !editEmployee || loadingOptions) return;

        const user = editEmployee.user || editEmployee.employee?.user || editEmployee;
        const employment = editEmployee.employment || editEmployee.employee?.employment || user?.employment || {};
        const payroll = editEmployee.payroll || user?.payroll || {};
        const employmentMeta = JSON.parse(localStorage.getItem(EMPLOYMENT_META_KEY) || '{}');
        const cachedEmployment =
            employmentMeta[`user:${user?.id}`] ||
            employmentMeta[`employee:${editEmployee.employee?.id}`] ||
            employmentMeta[`email:${String(user?.email || '').trim().toLowerCase()}`] ||
            {};
        const addressParts = splitAddressParts(user?.address || '');

        setFormData({
            ...initialForm,
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            dob: user?.dob || '',
            gender: user?.gender || '',
            bloodGroup: user?.bloodGroup || '',
            maritalStatus: typeof user?.maritalStatus === 'string'
                ? user.maritalStatus
                : user?.maritalStatus
                    ? 'married'
                    : 'single',
            profilePic: user?.profilePic || '',
            profilePicFile: null,
            employmentDepartmentId: getStringId(
                employment.departmentId ||
                employment.department?.id ||
                cachedEmployment.departmentId ||
                '',
            ),
            employmentDepartmentName:
                employment.department?.name ||
                employment.departmentName ||
                cachedEmployment.department ||
                '',
            employmentDesignationId: getStringId(
                employment.designationId ||
                employment.designation?.id ||
                cachedEmployment.designationId ||
                '',
            ),
            employmentJobTitle:
                employment.jobTitle ||
                employment.designation?.name ||
                cachedEmployment.designation ||
                '',
            employmentJoiningDate:
                String(
                    employment.dateOfJoining ||
                    employment.joiningDate ||
                    cachedEmployment.dateOfJoining ||
                    user?.createdAt ||
                    '',
                ).slice(0, 10),
            employmentReportingManagerId: getStringId(
                employment.reportingManagerId ||
                employment.reportingManager?.id ||
                cachedEmployment.reportingManagerId ||
                '',
            ),
            employmentReportingManagerName:
                employment.reportingManager?.name ||
                cachedEmployment.reportingManagerName ||
                '',
            employmentWorkLocation:
                employment.workLocation ||
                cachedEmployment.workLocation ||
                '',
            employmentBranch:
                employment.branch ||
                cachedEmployment.branch ||
                '',
            employmentContractType:
                employment.contractType ||
                cachedEmployment.contractType ||
                'Full-time',
            address: user?.addressLine || addressParts.street || '',
            city: user?.city || addressParts.city || '',
            state: user?.state || addressParts.state || '',
            postalCode: user?.postalCode || addressParts.postalCode || '',
            contactName: user?.eContactName || '',
            contactNumber: user?.eContactNumber || '',
            relation: user?.eRelation || '',
            ctc: payroll.ctc || '',
            currency: payroll.currency || 'INR',
            paymentMode: payroll.paymentMode || 'bank_transfer',
            baseSalary: payroll.baseSalary || '',
            monthlyGross: payroll.monthlyGross || '',
            monthlyPay: payroll.monthlyPay || '',
            bankName: payroll.bankName || '',
            accountNumber: payroll.accountNumber || '',
            ifscCode: payroll.ifscCode || '',
            documents: Array.isArray(editEmployee.documents)
                ? editEmployee.documents.map((file) => ({
                    name: file.name || file.fileName || 'Document',
                    size: file.size || file.fileSize || 0,
                    type: file.type || file.mimeType || 'application/octet-stream',
                    url: file.url || file.fileUrl || '',
                }))
                : [],
            password: '',
            confirmPassword: '',
            role: user?.role?.name || user?.role || 'Employee',
            sendInvite: false,
            isAdmin: Boolean(user?.isAdmin),
        });
    }, [editEmployee, isEditMode, loadingOptions]);

    useEffect(() => {
        const warnBeforeUnload = (event) => {
            if (!isDirty || isSubmitting) return;
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', warnBeforeUnload);
        return () => window.removeEventListener('beforeunload', warnBeforeUnload);
    }, [isDirty, isSubmitting]);

    const setValue = (name, value) => {
        setFormData((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => ({ ...previous, [name]: undefined }));
        setIsDirty(true);
    };

    const hasDuplicateEmail = (employeeList, email, ignoreEmployeeId = null) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) return false;

        return employeeList.some((item) => {
            const user = item.user || item;
            const userId = user.id || user._id;
            if (ignoreEmployeeId && String(userId) === String(ignoreEmployeeId)) return false;
            return String(user.email || '').trim().toLowerCase() === normalizedEmail;
        });
    };

    const validateStep = (stepIndex) => {
        const nextErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d{10}$/;
        const normalizedEditEmail = String(formData.email || '').trim().toLowerCase();
        const normalizedOriginalEmail = String(originalEmail || '').trim().toLowerCase();

        if (stepIndex === 0) {
            if (!formData.name.trim()) nextErrors.name = 'Full name is required.';
            if (!formData.email.trim()) nextErrors.email = 'Work email is required.';
            else if (!emailPattern.test(formData.email)) nextErrors.email = 'Enter a valid email address.';
            else if (!(isEditMode && normalizedEditEmail === normalizedOriginalEmail) && hasDuplicateEmail(managers, formData.email, isEditMode ? editEmployeeId : null)) {
                nextErrors.email = 'An employee with this email already exists.';
            }
            if (!formData.phone) nextErrors.phone = 'Phone number is required.';
            else if (!phonePattern.test(formData.phone)) nextErrors.phone = 'Enter a valid 10-digit phone number.';
            if (!formData.dob) nextErrors.dob = 'Date of birth is required.';
            else if (new Date(formData.dob) >= new Date()) nextErrors.dob = 'Date of birth must be in the past.';
        }

        if (stepIndex === 1) {
            if (!isEditMode) {
                if (!formData.employmentDepartmentId) nextErrors.employmentDepartmentId = 'Department is required.';
                if (!formData.employmentJobTitle) nextErrors.employmentJobTitle = 'Designation is required.';
                if (!formData.employmentJoiningDate) nextErrors.employmentJoiningDate = 'Joining date is required.';
                if (!formData.employmentWorkLocation.trim()) nextErrors.employmentWorkLocation = 'Work location is required.';
            }
        }

        if (stepIndex === 2) {
            if (!formData.address.trim()) nextErrors.address = 'Residential address is required.';
            if (!formData.city.trim()) nextErrors.city = 'City is required.';
            if (formData.contactNumber && !phonePattern.test(formData.contactNumber)) {
                nextErrors.contactNumber = 'Enter a valid 10-digit phone number.';
            }
        }

        if (stepIndex === 3) {
            ['ctc', 'baseSalary', 'monthlyGross', 'monthlyPay'].forEach((field) => {
                if (formData[field] !== '' && Number(formData[field]) < 0) {
                    nextErrors[field] = 'Amount cannot be negative.';
                }
            });
            const hasSalaryAmount = ['ctc', 'baseSalary', 'monthlyGross', 'monthlyPay']
                .some((field) => formData[field] !== '');
            if (hasSalaryAmount && !formData.currency) nextErrors.currency = 'Select a currency for the salary details.';
        }

        if (stepIndex === 5) {
            if (!isEditMode && !formData.password) nextErrors.password = 'Temporary password is required.';
            else if (formData.password && formData.password.length < 8) nextErrors.password = 'Use at least 8 characters.';
            if (formData.password || formData.confirmPassword) {
                if (formData.confirmPassword !== formData.password) {
                    nextErrors.confirmPassword = 'Passwords do not match.';
                }
            } else if (!isEditMode && formData.confirmPassword !== formData.password) {
                nextErrors.confirmPassword = 'Passwords do not match.';
            }
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const goNext = () => {
        if (!validateStep(currentStep)) return;
        setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    };

    const goBack = () => {
        setErrors({});
        setCurrentStep((step) => Math.max(step - 1, 0));
    };

    const handleCancel = () => {
        if (isDirty) {
            setToast({
                type: 'warning',
                title: isEditMode ? 'Discard changes?' : 'Discard employee setup?',
                message: isEditMode
                    ? 'Your unsaved updates will be lost.'
                    : 'Your unsaved information will be lost.',
                persistent: true,
                actions: [
                    {
                        label: 'Keep editing',
                        onClick: () => setToast(null),
                    },
                    {
                        label: isEditMode ? 'Discard changes' : 'Discard',
                        variant: 'danger',
                        onClick: () => {
                            localStorage.removeItem(draftKey);
                            setIsDirty(false);
                            setToast(null);
                            navigate('/hrms/employees');
                        },
                    },
                ],
            });
            return;
        }
        localStorage.removeItem(draftKey);
        navigate('/hrms/employees');
    };

    const handleProfilePhoto = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > MAX_DOCUMENT_SIZE) {
            setErrors((previous) => ({ ...previous, profilePicFile: 'Use a JPG or PNG image smaller than 5 MB.' }));
            return;
        }
        setValue('profilePicFile', file);
        setValue('profilePic', URL.createObjectURL(file));
    };

    const handleDocuments = (event) => {
        const files = Array.from(event.target.files || []);
        const invalid = files.find((file) => !ALLOWED_DOCUMENT_TYPES.includes(file.type) || file.size > MAX_DOCUMENT_SIZE);
        if (invalid) {
            setErrors((previous) => ({
                ...previous,
                documents: `${invalid.name} must be a PDF, JPG, or PNG smaller than 5 MB.`,
            }));
            return;
        }
        setValue('documents', [...formData.documents, ...files]);
    };

    const createEmployeeRecord = async () => {
        setIsSubmitting(true);
        try {
            let profilePicUrl = '';
            if (formData.profilePicFile) {
                const uploadResponse = await employeeService.uploadImage(formData.profilePicFile);
                if (!uploadResponse.success) throw new Error(uploadResponse.message || 'Profile photo upload failed.');
                profilePicUrl = uploadResponse.url;
            } else if (
                formData.profilePic
                && !String(formData.profilePic).startsWith('blob:')
            ) {
                profilePicUrl = formData.profilePic;
            }

            let uploadedDocuments = [];
            const documentsToUpload = formData.documents.filter((file) => typeof File !== 'undefined' && file instanceof File);
            const existingDocuments = formData.documents.filter((file) => !(typeof File !== 'undefined' && file instanceof File));
            if (documentsToUpload.length) {
                const documentResponse = await employeeService.uploadDocuments(documentsToUpload);
                if (!documentResponse.success) {
                    throw new Error(documentResponse.message || 'Document upload failed.');
                }
                uploadedDocuments = documentResponse.files;
            }

            const hasPayrollDetails = [
                'ctc',
                'baseSalary',
                'monthlyGross',
                'monthlyPay',
                'bankName',
                'accountNumber',
                'ifscCode',
            ]
                .some((field) => formData[field] !== '');

            const payload = {
                name: formData.name.trim(),
                gender: formData.gender,
                dob: formData.dob,
                bloodGroup: formData.bloodGroup,
                isAdmin: formData.isAdmin,
                maritalStatus: formData.maritalStatus === 'married',
                type: 'employee',
                eContactName: formData.contactName,
                eContactNumber: formData.contactNumber,
                eRelation: formData.relation,
                email: formData.email.trim(),
                phone: formData.phone,
                address: [formData.address, formData.city, formData.state, formData.postalCode].filter(Boolean).join(', '),
                addressLine: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                postalCode: formData.postalCode,
                profilePic: profilePicUrl,
                sendInvite: formData.sendInvite,
                employment: {
                    departmentId: Number(formData.employmentDepartmentId) || null,
                    designationId: Number(formData.employmentDesignationId) || null,
                    jobTitle: formData.employmentJobTitle,
                    reportingManager: Number(formData.employmentReportingManagerId) || null,
                    dateOfJoining: formData.employmentJoiningDate,
                    workLocation: formData.employmentWorkLocation,
                    branch: formData.employmentBranch,
                    contractType: formData.employmentContractType,
                    primaryRoles: formData.role,
                    empStatus: true,
                },
                payroll: hasPayrollDetails ? {
                    structure: `${formData.currency} annual CTC`,
                    currency: formData.currency,
                    ctc: String(formData.ctc || 0),
                    monthlyGross: String(formData.monthlyGross || 0),
                    monthlyPay: String(formData.monthlyPay || 0),
                    paymentMode: formData.paymentMode,
                    departmentId: Number(formData.employmentDepartmentId),
                    baseSalary: String(formData.baseSalary || 0),
                    bankName: formData.bankName,
                    accountNumber: formData.accountNumber,
                    ifscCode: formData.ifscCode,
                } : undefined,
                documents: [
                    ...existingDocuments.map((file) => ({
                        type: file.type || file.mimeType || 'file',
                        url: file.url || file.fileUrl || '',
                        fileName: file.fileName || file.name || 'document',
                        mimeType: file.mimeType || file.type || '',
                        fileSize: file.fileSize || file.size || 0,
                    })),
                    ...uploadedDocuments.map((file) => ({
                        type: file.type,
                        url: file.url,
                        fileName: file.name,
                        mimeType: file.type,
                        fileSize: file.size,
                    })),
                ],
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            if (!hasPayrollDetails) {
                delete payload.payroll;
            }

            const employeeResponse = isEditMode
                ? await employeeService.updateEmployee(editEmployeeId, payload)
                : await employeeService.addEmployee(payload);

            if (!employeeResponse.success) {
                throw new Error(employeeResponse.message || `Employee could not be ${isEditMode ? 'updated' : 'created'}.`);
            }

            const savedUser = employeeResponse.data?.user || employeeResponse.data || {};
            const savedEmployee = employeeResponse.data?.employee || {};
            const resolvedEmployeeId = savedEmployee.id || editEmployeeId || null;
            const employmentMeta = JSON.parse(localStorage.getItem(EMPLOYMENT_META_KEY) || '{}');
            const meta = {
                userId: savedUser.id || null,
                employeeId: resolvedEmployeeId,
                email: formData.email.trim().toLowerCase(),
                departmentId: Number(formData.employmentDepartmentId) || null,
                department: formData.employmentDepartmentName,
                designationId: Number(formData.employmentDesignationId) || null,
                designation: formData.employmentJobTitle,
                jobTitle: formData.employmentJobTitle,
                dateOfJoining: formData.employmentJoiningDate,
                updatedAt: Date.now(),
            };
            employmentMeta[`email:${meta.email}`] = meta;
            if (meta.userId) employmentMeta[`user:${meta.userId}`] = meta;
            if (meta.employeeId) employmentMeta[`employee:${meta.employeeId}`] = meta;
            localStorage.setItem(EMPLOYMENT_META_KEY, JSON.stringify(employmentMeta));

            localStorage.removeItem(draftKey);
            setIsDirty(false);

            if (!isEditMode && offerId && savedUser.id) {
                await hiringService.linkOfferEmployee(Number(offerId), savedUser.id);
            }

            setToast({
                type: 'success',
                title: isEditMode ? 'Employee updated' : 'Employee created',
                message: isEditMode
                    ? `${formData.name} was updated successfully.`
                    : `${formData.name} is now part of your organization.`,
            });
            window.setTimeout(() => {
                if (!isEditMode && offerId) {
                    navigate(`/hrms/hiring-and-recruitment/offer-letter-accepted-list/${offerId}/onboarding`);
                    return;
                }
                navigate('/hrms/employees');
            }, 900);
            return true;
        } catch (error) {
            const duplicateEmail = /email|already exists|duplicate/i.test(error.message || '');
            if (duplicateEmail) {
                setCurrentStep(0);
                setErrors((previous) => ({
                    ...previous,
                    email: 'An employee with this email already exists.',
                }));
            }
            setToast({
                type: 'error',
                title: duplicateEmail ? 'Email already exists' : isEditMode ? 'Employee was not updated' : 'Employee was not created',
                message: duplicateEmail
                    ? 'Use a different work email to continue.'
                    : error.message || 'Please try again.',
            });
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSeatUpgradeAndCreate = async () => {
        if (subscriptionInfo?.hasActivePlan === false) {
            setToast({
                type: 'error',
                title: 'Subscription required',
                message: 'Your subscription is inactive or expired. Please upgrade your plan first.',
            });
            return;
        }

        setToast(null);
        setIsSubmitting(true);

        try {
            const user = getCurrentUser();
            const seatOrder = await subscriptionService.createAddonOrder('extra_employee', 1);

            if (!seatOrder.success) {
                throw new Error(seatOrder.message || 'Failed to create extra employee seat order.');
            }

            const paymentResult = await subscriptionService.openAddonCheckout(seatOrder.data, user);

            if (!paymentResult.success) {
                throw new Error(paymentResult.message || 'Seat payment was not completed.');
            }

            await loadOptions();
            setToast({
                type: 'success',
                title: 'Extra seat added',
                message: `One additional employee seat has been added to your plan for ₹${subscriptionInfo?.extraEmployeePriceInr || 51}.`,
            });
        } catch (error) {
            setToast({
                type: 'error',
                title: 'Extra seat not added',
                message: error.message || 'Please try again.',
            });
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
        await createEmployeeRecord();
    };

    const handleSubmitEmployee = async () => {
        for (const stepIndex of [0, 1, 2, 3, 5]) {
            if (!validateStep(stepIndex)) {
                setCurrentStep(stepIndex);
                setToast({
                    type: 'error',
                    title: 'Details need attention',
                    message: `Please complete the required fields in ${steps[stepIndex].title}.`,
                });
                return;
            }
        }

        if (isEditMode) {
            await createEmployeeRecord();
            return;
        }

        if (subscriptionInfo?.canAddEmployee === false && subscriptionInfo?.hasActivePlan !== false) {
            const maxEmployees = subscriptionInfo?.maxEmployees ?? 0;
            const price = subscriptionInfo?.extraEmployeePriceInr ?? 51;
            setToast({
                type: 'warning',
                title: 'Employee limit reached',
                message: `You have reached your plan limit. You can only have ${maxEmployees} users. If you want to add more users you have to pay ₹${price} per person.`,
                persistent: true,
                actions: [
                    {
                        label: 'Cancel',
                        onClick: () => setToast(null),
                    },
                    {
                        label: 'Proceed to pay',
                        variant: 'danger',
                        onClick: handleSeatUpgradeAndCreate,
                    },
                ],
            });
            return;
        }

        if (subscriptionInfo?.hasActivePlan === false) {
            setToast({
                type: 'error',
                title: 'Subscription required',
                message: 'Your subscription is inactive or expired. Please upgrade your plan first.',
            });
            return;
        }

        await createEmployeeRecord();
    };

    const managerOptions = useMemo(
        () =>
            managers.map((manager) => {
                const user = manager.user || manager;
                return { id: user.id || user._id, name: user.name || user.email || 'Employee' };
            }),
        [managers],
    );

    const isBusy = loadingOptions || (isEditMode && loadingEmployee && !editEmployee);

    if (isEditMode && loadingEmployee && !editEmployee) {
        return (
            <div className="employee-wizard-page bg-slate-100 p-3 sm:p-5">
                <div className="mx-auto flex h-[calc(100vh-2.5rem)] max-w-[1500px] items-center justify-center rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 size={28} className="animate-spin text-violet-600" />
                        <p className="text-sm font-medium text-slate-500">Loading employee details…</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderStep = () => {
        if (currentStep === 0) {
            return (
                <div className="animate-[fadeIn_.25s_ease-out]">
                    <SectionIntro
                        eyebrow="Step 1 of 7"
                        title={isEditMode ? 'Update employee basics' : 'Let’s start with the employee'}
                        description={isEditMode ? 'Update core identity and contact details. Nothing is saved until you confirm the changes.' : 'Enter their core identity and contact details. Nothing is submitted until the final confirmation.'}
                    />
                    <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:flex-row sm:items-center">
                        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-violet-100 text-violet-700">
                            {formData.profilePic ? (
                                <img src={formData.profilePic} alt="Employee preview" className="h-full w-full object-cover" />
                            ) : (
                                <UserRound size={30} />
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Profile photo</p>
                            <p className="mt-1 text-sm text-slate-500">JPG or PNG, up to 5 MB. You can also add this later.</p>
                            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-violet-300 hover:text-violet-700">
                                <Upload size={15} /> Choose photo
                                <input type="file" accept=".jpg,.jpeg,.png" onChange={handleProfilePhoto} className="hidden" />
                            </label>
                            {errors.profilePicFile && <p className="mt-2 text-xs font-medium text-red-600">{errors.profilePicFile}</p>}
                        </div>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                        <Field label={requiredLabel('Full name')} error={errors.name}>
                            <input className={inputClass('name')} value={formData.name} onChange={(e) => setValue('name', e.target.value)} placeholder="e.g. Aanya Sharma" />
                        </Field>
                        <Field label={requiredLabel('Work email')} error={errors.email}>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3 text-slate-400" size={17} />
                                <input className={`${inputClass('email')} pl-10`} type="email" value={formData.email} onChange={(e) => setValue('email', e.target.value)} placeholder="name@company.com" />
                            </div>
                        </Field>
                        <Field label={requiredLabel('Phone number')} error={errors.phone}>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-3 text-slate-400" size={17} />
                                <input className={`${inputClass('phone')} pl-10`} inputMode="numeric" value={formData.phone} onChange={(e) => setValue('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" />
                            </div>
                        </Field>
                        <Field label={requiredLabel('Date of birth')} error={errors.dob}>
                            <input className={inputClass('dob')} type="date" value={formData.dob} onChange={(e) => setValue('dob', e.target.value)} />
                        </Field>
                        <Field label="Gender">
                            <select className={inputClass('gender')} value={formData.gender} onChange={(e) => setValue('gender', e.target.value)}>
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </Field>
                        <Field label="Blood group">
                            <select className={inputClass('bloodGroup')} value={formData.bloodGroup} onChange={(e) => setValue('bloodGroup', e.target.value)}>
                                <option value="">Select blood group</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => <option key={group} value={group.toLowerCase()}>{group}</option>)}
                            </select>
                        </Field>
                        <Field label="Marital status">
                            <select className={inputClass('maritalStatus')} value={formData.maritalStatus} onChange={(e) => setValue('maritalStatus', e.target.value)}>
                                <option value="">Select status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                            </select>
                        </Field>
                    </div>
                </div>
            );
        }

        if (currentStep === 1) {
            return (
                <div className="animate-[fadeIn_.25s_ease-out]">
                    <SectionIntro eyebrow="Step 2 of 7" title="Define their role" description="Set the employee’s place in the organization, reporting line, and joining information." />
                    {loadingOptions && (
                        <div className="mb-5 flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700">
                            <Loader2 size={16} className="animate-spin" /> Loading organization options…
                        </div>
                    )}
                    <div className="grid gap-5 md:grid-cols-2">
                        <Field label={isEditMode ? 'Department' : requiredLabel('Department')} error={errors.employmentDepartmentId}>
                            <select
                                className={inputClass('employmentDepartmentId')}
                                value={formData.employmentDepartmentId}
                                onChange={(e) => {
                                    const selected = departments.find((department) => String(department.id || department._id) === e.target.value);
                                    setValue('employmentDepartmentId', e.target.value);
                                    setValue('employmentDepartmentName', selected?.name || '');
                                }}
                            >
                                <option value="">Select department</option>
                                {departments.map((department) => <option key={department.id || department._id} value={department.id || department._id}>{department.name}</option>)}
                            </select>
                        </Field>
                        <Field label={isEditMode ? 'Designation' : requiredLabel('Designation')} error={errors.employmentJobTitle}>
                            <select
                                className={inputClass('employmentJobTitle')}
                                value={formData.employmentJobTitle}
                                onChange={(e) => {
                                    const selected = designations.find((designation) => designation.name === e.target.value);
                                    setValue('employmentJobTitle', e.target.value);
                                    setValue('employmentDesignationId', selected?.id || selected?._id || '');
                                }}
                            >
                                <option value="">Select designation</option>
                                {designations.map((designation) => <option key={designation.id || designation._id || designation.name} value={designation.name}>{designation.name}</option>)}
                            </select>
                        </Field>
                        <Field label={isEditMode ? 'Date of joining' : requiredLabel('Date of joining')} error={errors.employmentJoiningDate}>
                            <input className={inputClass('employmentJoiningDate')} type="date" value={formData.employmentJoiningDate} onChange={(e) => setValue('employmentJoiningDate', e.target.value)} />
                        </Field>
                        <Field label="Reporting manager">
                            <select
                                className={inputClass('employmentReportingManagerId')}
                                value={formData.employmentReportingManagerId}
                                onChange={(e) => {
                                    const selected = managerOptions.find((manager) => String(manager.id) === e.target.value);
                                    setValue('employmentReportingManagerId', e.target.value);
                                    setValue('employmentReportingManagerName', selected?.name || '');
                                }}
                            >
                                <option value="">Select reporting manager</option>
                                {managerOptions.map((manager) => <option key={manager.id} value={manager.id}>{manager.name}</option>)}
                            </select>
                        </Field>
                        <Field label={isEditMode ? 'Work location' : requiredLabel('Work location')} error={errors.employmentWorkLocation}>
                            <input className={inputClass('employmentWorkLocation')} value={formData.employmentWorkLocation} onChange={(e) => setValue('employmentWorkLocation', e.target.value)} placeholder="e.g. Mumbai HQ" />
                        </Field>
                        <Field label="Branch">
                            <input className={inputClass('employmentBranch')} value={formData.employmentBranch} onChange={(e) => setValue('employmentBranch', e.target.value)} placeholder="e.g. West Region" />
                        </Field>
                        <Field label="Employment type">
                            <select className={inputClass('employmentContractType')} value={formData.employmentContractType} onChange={(e) => setValue('employmentContractType', e.target.value)}>
                                {['Full-time', 'Part-time', 'Contract', 'Internship', 'Consultant'].map((type) => <option key={type}>{type}</option>)}
                            </select>
                        </Field>
                    </div>
                </div>
            );
        }

        if (currentStep === 2) {
            return (
                <div className="animate-[fadeIn_.25s_ease-out]">
                    <SectionIntro eyebrow="Step 3 of 7" title="Add contact information" description="Capture the employee’s residential address and an emergency contact for workplace safety." />
                    <div className="grid gap-5 md:grid-cols-2">
                        <Field label={requiredLabel('Residential address')} error={errors.address} className="md:col-span-2">
                            <textarea className={`${inputClass('address')} min-h-24 resize-y py-3`} value={formData.address} onChange={(e) => setValue('address', e.target.value)} placeholder="House number, street, and locality" />
                        </Field>
                        <Field label={requiredLabel('City')} error={errors.city}>
                            <input className={inputClass('city')} value={formData.city} onChange={(e) => setValue('city', e.target.value)} placeholder="City" />
                        </Field>
                        <Field label="State">
                            <input className={inputClass('state')} value={formData.state} onChange={(e) => setValue('state', e.target.value)} placeholder="State" />
                        </Field>
                        <Field label="Postal code">
                            <input className={inputClass('postalCode')} inputMode="numeric" value={formData.postalCode} onChange={(e) => setValue('postalCode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit PIN code" />
                        </Field>
                    </div>
                    <div className="my-8 border-t border-slate-100" />
                    <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900"><UsersRound size={19} className="text-violet-600" /> Emergency contact</h3>
                    <div className="grid gap-5 md:grid-cols-3">
                        <Field label="Contact name">
                            <input className={inputClass('contactName')} value={formData.contactName} onChange={(e) => setValue('contactName', e.target.value)} placeholder="Full name" />
                        </Field>
                        <Field label="Relationship">
                            <input className={inputClass('relation')} value={formData.relation} onChange={(e) => setValue('relation', e.target.value)} placeholder="e.g. Parent" />
                        </Field>
                        <Field label="Contact number" error={errors.contactNumber}>
                            <input className={inputClass('contactNumber')} inputMode="numeric" value={formData.contactNumber} onChange={(e) => setValue('contactNumber', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" />
                        </Field>
                    </div>
                </div>
            );
        }

        if (currentStep === 3) {
            return (
                <div className="animate-[fadeIn_.25s_ease-out]">
                    <SectionIntro eyebrow="Step 4 of 7 · Optional" title="Set up salary and payroll" description="You can add compensation now or skip this step and complete payroll later from the employee profile." />
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                        <CircleDollarSign size={18} className="mt-0.5 shrink-0" />
                        <p>This step is optional. Leave all fields blank and click Continue to create the employee without payroll details.</p>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        <Field label="Annual CTC" error={errors.ctc}>
                            <input className={inputClass('ctc')} type="number" min="0" value={formData.ctc} onChange={(e) => setValue('ctc', e.target.value)} placeholder="e.g. 1200000" />
                        </Field>
                        <Field label="Currency" error={errors.currency}>
                            <select className={inputClass('currency')} value={formData.currency} onChange={(e) => setValue('currency', e.target.value)}>
                                <option value="INR">INR — Indian Rupee</option>
                                <option value="USD">USD — US Dollar</option>
                                <option value="EUR">EUR — Euro</option>
                                <option value="GBP">GBP — British Pound</option>
                            </select>
                        </Field>
                        <Field label="Payment mode">
                            <select className={inputClass('paymentMode')} value={formData.paymentMode} onChange={(e) => setValue('paymentMode', e.target.value)}>
                                <option value="bank_transfer">Bank transfer</option>
                                <option value="cheque">Cheque</option>
                                <option value="cash">Cash</option>
                            </select>
                        </Field>
                        <Field label="Basic salary" error={errors.baseSalary}>
                            <input className={inputClass('baseSalary')} type="number" min="0" value={formData.baseSalary} onChange={(e) => setValue('baseSalary', e.target.value)} placeholder="Monthly basic" />
                        </Field>
                        <Field label="Monthly gross" error={errors.monthlyGross}>
                            <input className={inputClass('monthlyGross')} type="number" min="0" value={formData.monthlyGross} onChange={(e) => setValue('monthlyGross', e.target.value)} placeholder="Monthly gross" />
                        </Field>
                        <Field label="Monthly net pay" error={errors.monthlyPay}>
                            <input className={inputClass('monthlyPay')} type="number" min="0" value={formData.monthlyPay} onChange={(e) => setValue('monthlyPay', e.target.value)} placeholder="Estimated take-home" />
                        </Field>
                        <Field label="Bank name">
                            <input className={inputClass('bankName')} value={formData.bankName} onChange={(e) => setValue('bankName', e.target.value)} placeholder="Bank name" />
                        </Field>
                        <Field label="Account number">
                            <input className={inputClass('accountNumber')} value={formData.accountNumber} onChange={(e) => setValue('accountNumber', e.target.value.replace(/\D/g, ''))} placeholder="Account number" />
                        </Field>
                        <Field label="IFSC code">
                            <input className={inputClass('ifscCode')} value={formData.ifscCode} onChange={(e) => setValue('ifscCode', e.target.value.toUpperCase())} placeholder="e.g. HDFC0001234" />
                        </Field>
                    </div>
                </div>
            );
        }

        if (currentStep === 4) {
            return (
                <div className="animate-[fadeIn_.25s_ease-out]">
                    <SectionIntro eyebrow="Step 5 of 7" title="Collect employee documents" description="Add identity, education, or employment records. Documents are optional and can also be completed from the employee profile." />
                    <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-violet-400 hover:bg-violet-50/50">
                        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm"><Upload size={22} /></span>
                        <span className="font-bold text-slate-800">Choose files to upload</span>
                        <span className="mt-1 text-sm text-slate-500">PDF, JPG, or PNG · Maximum 5 MB each</span>
                        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocuments} className="hidden" />
                    </label>
                    {errors.documents && <p className="mt-2 text-sm font-medium text-red-600">{errors.documents}</p>}
                    {formData.documents.length > 0 && (
                        <div className="mt-6 space-y-3">
                            {formData.documents.map((file, index) => (
                                <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><FileText size={17} /></span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
                                            <p className="text-xs text-slate-400">{file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Select again before upload'}</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setValue('documents', formData.documents.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${file.name}`}><X size={17} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        if (currentStep === 5) {
            return (
                <div className="animate-[fadeIn_.25s_ease-out]">
                    <SectionIntro eyebrow="Step 6 of 7" title="Configure account access" description={isEditMode ? 'Leave the password blank to keep the current login details, or set a new password if needed.' : 'Create secure sign-in credentials and choose the employee’s initial access level.'} />
                    <div className="grid gap-5 md:grid-cols-2">
                        <Field label={requiredLabel(isEditMode ? 'New password' : 'Temporary password')} error={errors.password} hint={isEditMode ? 'Leave blank to keep the current password.' : 'Use at least 8 characters.'}>
                            <input className={inputClass('password')} type="password" value={formData.password} onChange={(e) => setValue('password', e.target.value)} placeholder="Minimum 8 characters" />
                        </Field>
                        <Field label={requiredLabel('Confirm password')} error={errors.confirmPassword}>
                            <input className={inputClass('confirmPassword')} type="password" value={formData.confirmPassword} onChange={(e) => setValue('confirmPassword', e.target.value)} placeholder="Re-enter password" />
                        </Field>
                        <Field label="Access role">
                            <select className={inputClass('role')} value={formData.role} onChange={(e) => setValue('role', e.target.value)}>
                                <option>Employee</option>
                                <option>Manager</option>
                                <option>HR Executive</option>
                            </select>
                        </Field>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                            <label className="flex cursor-pointer items-start gap-3">
                                <input type="checkbox" checked={formData.sendInvite} onChange={(e) => setValue('sendInvite', e.target.checked)} className="mt-1 h-4 w-4 accent-violet-600" />
                                <span>
                                    <span className="block text-sm font-bold text-slate-800">Send account invitation</span>
                                    <span className="mt-1 block text-xs leading-5 text-slate-500">The employee will be notified at {formData.email || 'their work email'} after the account is created.</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="animate-[fadeIn_.25s_ease-out]">
                <SectionIntro eyebrow="Step 7 of 7" title="Review employee details" description={isEditMode ? 'Check each section carefully. The changes will be applied after you confirm below.' : 'Check each section carefully. The employee record will only be created after you confirm below.'} />
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={19} />
                    <p><strong>Ready for review.</strong> {isEditMode ? 'No changes have been saved yet. Click Save changes when everything looks right.' : 'No employee record has been created yet. Click Create employee when everything looks right.'}</p>
                </div>
                <div className="grid gap-5">
                    <ReviewSection title="Personal information" icon={UserRound} onEdit={() => setCurrentStep(0)}>
                        <ReviewGrid items={[['Full name', formData.name], ['Work email', formData.email], ['Phone', formData.phone], ['Date of birth', formData.dob], ['Gender', formData.gender], ['Blood group', formData.bloodGroup]]} />
                    </ReviewSection>
                    <ReviewSection title="Employment details" icon={Building2} onEdit={() => setCurrentStep(1)}>
                        <ReviewGrid items={[['Department', formData.employmentDepartmentName], ['Designation', formData.employmentJobTitle], ['Joining date', formData.employmentJoiningDate], ['Manager', formData.employmentReportingManagerName], ['Work location', formData.employmentWorkLocation], ['Employment type', formData.employmentContractType]]} />
                    </ReviewSection>
                    <ReviewSection title="Contact details" icon={MapPin} onEdit={() => setCurrentStep(2)}>
                        <ReviewGrid items={[['Address', [formData.address, formData.city, formData.state, formData.postalCode].filter(Boolean).join(', ')], ['Emergency contact', formData.contactName], ['Relationship', formData.relation], ['Emergency phone', formData.contactNumber]]} />
                    </ReviewSection>
                    <ReviewSection title="Salary and payroll" icon={CircleDollarSign} onEdit={() => setCurrentStep(3)}>
                        <ReviewGrid items={[['Annual CTC', formData.ctc ? `${formData.currency} ${Number(formData.ctc).toLocaleString()}` : '—'], ['Monthly gross', formData.monthlyGross], ['Monthly net', formData.monthlyPay], ['Payment mode', formData.paymentMode.replace('_', ' ')], ['Bank', formData.bankName], ['Account number', formData.accountNumber ? `•••• ${formData.accountNumber.slice(-4)}` : '—']]} />
                    </ReviewSection>
                    <ReviewSection title="Documents" icon={FileText} onEdit={() => setCurrentStep(4)}>
                        <ReviewGrid items={[['Files selected', formData.documents.length ? `${formData.documents.length} document${formData.documents.length > 1 ? 's' : ''}` : 'No documents added']]} />
                    </ReviewSection>
                    <ReviewSection title="Account and permissions" icon={KeyRound} onEdit={() => setCurrentStep(5)}>
                        <ReviewGrid items={[['Role', formData.role], ['Invitation', formData.sendInvite ? (isEditMode ? 'Send after update' : 'Send after creation') : 'Do not send'], ['Login email', formData.email]]} />
                    </ReviewSection>
                </div>
            </div>
        );
    };

    return (
        <>
            <Toast toast={toast} onClose={() => setToast(null)} />
            <div className="employee-wizard-page bg-slate-100 p-3 sm:p-5">
                <div className="employee-wizard-card mx-auto flex h-full max-w-[1500px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                    <header className="z-20 shrink-0 border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
                        <div className="flex items-center justify-between gap-5">
                            <div className="min-w-0">
                                <button type="button" onClick={handleCancel} className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-violet-700">
                                    <ArrowLeft size={14} /> Employee list
                                </button>
                                <div className="flex items-center gap-3">
                                    <span className="hidden h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200 sm:flex"><UserRound size={20} /></span>
                                    <div>
                                        <h1 className="truncate text-xl font-bold tracking-tight text-slate-950">{isEditMode ? 'Edit employee' : 'Add new employee'}</h1>
                                        <p className="mt-0.5 text-xs text-slate-500">{isEditMode ? 'Update the employee profile using the same step-by-step flow.' : 'Complete all required details before creating the profile.'}</p>
                                    </div>
                                </div>
                            </div>
                            <button type="button" onClick={handleCancel} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close employee wizard"><X size={20} /></button>
                        </div>
                    </header>

                    <div className="shrink-0 border-b border-slate-200 bg-slate-50/80 px-5 py-4 sm:px-7">
                        <div className="flex items-start overflow-x-auto pb-1 no-scrollbar">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isComplete = index < currentStep;
                                const isCurrent = index === currentStep;
                                return (
                                    <React.Fragment key={step.title}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (index < currentStep || currentStep === steps.length - 1) {
                                                    setErrors({});
                                                    setCurrentStep(index);
                                                }
                                            }}
                                            disabled={index > currentStep && currentStep !== steps.length - 1}
                                            className={`group flex min-w-[112px] items-start gap-2.5 text-left ${index > currentStep && currentStep !== steps.length - 1 ? 'cursor-default' : ''}`}
                                        >
                                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition ${
                                                isComplete ? 'border-violet-600 bg-violet-600 text-white' : isCurrent ? 'border-violet-600 bg-white text-violet-700 ring-4 ring-violet-100' : 'border-slate-300 bg-white text-slate-400'
                                            }`}>
                                                {isComplete ? <Check size={15} /> : <Icon size={15} />}
                                            </span>
                                            <span>
                                                <span className={`block whitespace-nowrap text-xs font-bold ${isCurrent ? 'text-violet-700' : isComplete ? 'text-slate-700' : 'text-slate-400'}`}>{step.title}</span>
                                                <span className="mt-0.5 block whitespace-nowrap text-[10px] text-slate-400">{step.subtitle}</span>
                                            </span>
                                        </button>
                                        {index < steps.length - 1 && <span className={`mx-2 mt-4 h-px min-w-5 flex-1 ${index < currentStep ? 'bg-violet-400' : 'bg-slate-200'}`} />}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {subscriptionInfo && !isEditMode && (
                        <div className={`mx-5 mt-4 shrink-0 rounded-xl border px-4 py-2.5 text-xs sm:mx-7 ${subscriptionInfo.canAddEmployee ? 'border-violet-100 bg-violet-50 text-violet-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                            <strong className="capitalize">{subscriptionInfo.planType?.replace('_', ' ') || 'Active'} plan</strong>
                            <span className="mx-2 text-current opacity-40">•</span>
                            {subscriptionInfo.employeeCount ?? 0} of {subscriptionInfo.maxEmployees ?? 0} employee seats used
                            {!subscriptionInfo.canAddEmployee && subscriptionInfo.hasActivePlan !== false ? (
                                <>
                                    <span className="mx-2 text-current opacity-40">•</span>
                                    Extra seats available at ₹{subscriptionInfo.extraEmployeePriceInr ?? 51} per employee
                                </>
                            ) : null}
                        </div>
                    )}

                    <main className="employee-wizard-content min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-7 lg:px-10">
                        <div className="mx-auto max-w-5xl">{renderStep()}</div>
                    </main>

                    <footer className="z-20 shrink-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
                        <div className="mx-auto flex max-w-5xl flex-col-reverse items-stretch justify-end gap-3 sm:flex-row sm:items-center">
                            <div className="flex gap-3">
                                <button type="button" onClick={goBack} disabled={currentStep === 0 || isSubmitting} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none">
                                    <ArrowLeft size={16} /> Back
                                </button>
                                {currentStep < steps.length - 1 ? (
                                    <button type="button" onClick={goNext} disabled={isSubmitting} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-50 sm:flex-none">
                                        Continue <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleSubmitEmployee} disabled={isSubmitting || (!isEditMode && subscriptionInfo?.canAddEmployee === false) || isBusy} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
                                        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> {isEditMode ? 'Saving changes…' : 'Creating employee…'}</> : <>{isEditMode ? 'Save changes' : 'Create employee'} <ChevronRight size={16} /></>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default AddEmployee;
