/**
 * All user-facing copy for the Contact Verification prototype.
 * Edit strings here — every screen reads from this file.
 * The /copy route provides a live editor for these values.
 */

export const copy = {
  // ─── Agent Flow: Client Search ───
  search: {
    pageTitle: "Select or create a client",
    searchPlaceholder: "Search clients by name…",
    verifiedSection: "Verified clients",
    unverifiedSection: "Unverified clients",
    noResults: "No clients found",
    createNew: "Create new client",
    createNewSub: "Client not found? Create a new record.",
    formFirstName: "First name",
    formLastName: "Last name",
    formPhone: "Phone (optional)",
    formCreate: "Create client",
  },

  // ─── Agent Flow: Review Screen ───
  review: {
    pageTitle: "Review & send",
    policyholderLabel: "Policyholder",
    verifiedBadge: "Verified",
    unverifiedBadge: "Unverified",
    emailLabel: "Client email",
    emailHelper: "This email will be used to set up {name}'s online account.",
    emailPlaceholder: "client@email.com",
    sendButton: "Send review link",
    sendingButton: "Sending…",
    sentConfirmation: "Review link sent to {email}",
    resendButton: "Resend",
    changeEmailButton: "Change email",
    continueToPayment: "Continue to prepayment",
    // Coverage summary
    coverageTitle: "Coverage summary",
    propertyLabel: "Property",
    premiumLabel: "Annual premium",
    coverageLabel: "Dwelling coverage",
    deductibleLabel: "Deductible",
    effectiveLabel: "Effective date",
    // Collision prompt
    collisionTitle: "{email} is already set up as an account for {name} at your agency.",
    collisionUseExisting: "Use {name}'s account for this policy",
    collisionDifferent: "Set up a different account for this policy",
    collisionViewProfile: "View {name}'s profile",
  },

  // ─── Client Email ───
  email: {
    from: "Obie on behalf of {agency}",
    subject: "Your insurance for {address} is ready to review",
    greeting: "Hi {name},",
    body: "Your insurance policy for {address} is ready. Review the details and sign to complete your coverage.",
    premiumLine: "Annual premium: {premium}",
    prepaidLine: "Paid by {agency}",
    ctaButton: "Review & sign",
    footer: "This link expires in 7 days. If you have questions, reply to this email or contact your agent.",
    agentLine: "Your agent: {agent} at {agency}",
  },

  // ─── Client Click-Through ───
  clientReview: {
    pageTitle: "Review your policy",
    signedInAs: "Signed in as {email}",
    signTitle: "Sign to confirm",
    signHelper: "Type your full legal name to sign",
    signPlaceholder: "Full legal name",
    signButton: "Sign & continue",
    payTitle: "Payment",
    payHelper: "Enter your payment details to bind your policy.",
    payButton: "Pay {amount} & bind policy",
    prepaidNotice: "Payment has been made by {agency}. No payment required.",
    bindButton: "Bind policy",
    doneTitle: "You're covered.",
    doneSubtitle: "Your policy is now active.",
    donePolicyNumber: "Policy number: {number}",
    donePortalPrompt: "View documents and manage your account at any time.",
    donePortalLink: "Go to my account",
  },

  // ─── D2C Flow ───
  d2c: {
    entryTitle: "Get a quote in minutes",
    entrySubtitle: "Landlord and rental property insurance made simple.",
    emailLabel: "Email address",
    emailPlaceholder: "you@email.com",
    emailHelper: "We'll use this to save your quote and set up your account.",
    continueButton: "Continue",
    welcomeBack: "Welcome back! Check your email to sign in.",
    // End of quote / pre-checkout
    checkoutTitle: "Almost there — check your email",
    checkoutSubtitle: "We sent a link to {email} to complete your purchase.",
    checkoutExplainer: "This email will be used for your online account where you can access policy documents, make payments, and manage your coverage.",
    checkoutResend: "Didn't get it? Resend",
    checkoutChangeEmail: "Use a different email",
    // Logged-in client (skip verification)
    loggedInNotice: "Signed in as {email}",
    loggedInContinue: "Continue to checkout",
  },

  // ─── Email Update Confirmation ───
  emailUpdate: {
    confirmSubject: "Action required: confirm your updated email address",
    confirmBody: "Confirm your updated email address. This will be the email used to sign into your account. Your {count} active policies will be updated to reflect this new contact email.",
    confirmButton: "Confirm email update",
    notifySubject: "Your sign-in email is being changed",
    notifyBody: "Your Obie sign-in email is being changed to {newEmail}. If this wasn't you, click below to revert the change.",
    notifyRevert: "Revert this change",
    notifyFooter: "This revert link expires in 7 days.",
    // Merge
    mergeNotice: "Your policies will be consolidated with the existing account under {email}. Policy documents will still show {name} as the named insured. To change that, contact service.",
  },

  // ─── Agent/CSR: Client Profile Email Edit ───
  profileEdit: {
    pageTitle: "Edit client profile",
    currentEmailLabel: "Current email",
    newEmailLabel: "New email",
    newEmailPlaceholder: "new@email.com",
    saveButton: "Update email",
    helper: "Changing this email changes how {name} signs in. {name} will need to confirm the change. All {count} active policies will be updated.",
    pendingBadge: "Pending confirmation",
    // Collision (same-agency merge)
    collisionTitle: "{email} is already set up as an account for {name} at your agency.",
    collisionMerge: "Merge {currentName}'s policies into {name}'s account",
    collisionKeepSeparate: "Keep them separate",
    collisionViewProfile: "View {name}'s profile",
  },

  // ─── Halo: Internal Clients Tab ───
  halo: {
    pageTitle: "Clients",
    searchPlaceholder: "Search by name or email…",
    parentAccountsTab: "Verified accounts",
    unverifiedTab: "Unverified clients",
    parentEmail: "Email",
    parentName: "Display name",
    parentAka: "AKA",
    parentClients: "Partner clients",
    parentPolicies: "Policies",
    parentCreated: "Created",
    parentLastLogin: "Last sign-in",
    // Nested partner clients
    pcAgency: "Agency",
    pcName: "Client name",
    pcPolicies: "Policies",
    pcVerified: "Verified",
    // Unverified
    uvName: "Name",
    uvAgency: "Agency",
    uvQuotes: "Quotes",
    uvCreated: "Created",
    uvPendingLink: "Pending link",
  },

  // ─── Shared ───
  shared: {
    appName: "Obie",
    cancel: "Cancel",
    close: "Close",
    back: "Back",
    next: "Next",
    save: "Save",
    edit: "Edit",
  },
} as const;

// Helper to interpolate {variables} in copy strings
export function t(template: string, vars: Record<string, string | number> = {}): string {
  return Object.entries(vars).reduce(
    (str, [key, value]) => str.replace(new RegExp(`\\{${key}\\}`, "g"), String(value)),
    template
  );
}
