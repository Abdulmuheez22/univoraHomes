import { Link } from "react-router-dom";
import LegalLayout from "./LegalLayout";
import {
  LEGAL_JURISDICTION,
  SITE_NAME,
  SUPPORT_EMAIL,
  WHATSAPP_DISPLAY,
} from "../../lib/site";

const SECTIONS = [
  {
    id: "overview",
    heading: "Overview",
    body: (
      <>
        <p>
          This Privacy Policy explains how {SITE_NAME} ("we", "us", "our")
          collects, uses, shares, and protects personal information when you use
          our platform, and the choices and rights you have.
        </p>
        <p>
          We handle personal information in accordance with the Nigeria Data
          Protection Act 2023 (NDPA) and other applicable data protection laws of
          the {LEGAL_JURISDICTION}, where we are based. This policy should be
          read together with our <Link to="/terms">Terms of Service</Link>.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    heading: "Information we collect",
    body: (
      <>
        <p>
          <strong>Information you give us when you register.</strong> Your full
          name, email address, phone number, role (landlord, tenant, or agent),
          state, city, and password. Passwords are stored in hashed form — we do
          not keep your password in plain text and cannot read it.
        </p>
        <p>
          <strong>Verification data.</strong> When you confirm your email, we
          generate a one-time password (OTP) and record its expiry time and your
          verification status.
        </p>
        <p>
          <strong>Listing content.</strong> If you publish a property, the
          property name, type, address, city, state, category, description,
          target rent, and any photographs you upload. Listings are public and
          are associated with your account.
        </p>
        <p>
          <strong>Activity on the Platform.</strong> The properties you save, the
          connection requests you send or receive (including which property they
          relate to and their status), and your account role.
        </p>
        <p>
          We do not collect payment card details, bank details, or any other
          financial account information, because {SITE_NAME} does not process
          payments.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    heading: "How we use your information",
    body: (
      <>
        <p>We use personal information to:</p>
        <ul>
          <li>
            create and manage your account, and authenticate your sign-in;
          </li>
          <li>
            send your OTP and verify your email address;
          </li>
          <li>
            publish and display property listings to other users;
          </li>
          <li>
            enable connection requests — this is what shares your contact
            details with a landlord or agent you contact, and vice versa;
          </li>
          <li>
            operate, maintain, troubleshoot, and secure the Platform, and
          </li>
          <li>
            respond to your enquiries, complaints, and support requests, and
            comply with legal obligations.
          </li>
        </ul>
        <p>
          Where the NDPA requires a lawful basis, we rely on: your consent (for
          example, when you accept these terms and create an account); the
          performance of our agreement with you (providing the Platform); our
          legitimate interests in operating and securing the Platform; and
          compliance with legal obligations.
        </p>
        <p>
          We do not sell your personal information, and we do not use it for
          automated decision-making that produces legal or similarly significant
          effects.
        </p>
      </>
    ),
  },
  {
    id: "listing-visibility",
    heading: "What other users can see",
    body: (
      <>
        <p>
          <strong>Listings are public.</strong> Details of a published property —
          including its address, description, price, and images — are visible to
          anyone visiting the Platform, including visitors who are not signed in.
        </p>
        <p>
          <strong>Contact details follow connection requests.</strong> Your name
          and contact details are shared with the other party once you engage via
          a connection request on a listing. This is how landlords and tenants
          reach each other, so please only send a request to someone you are
          willing to be contacted by.
        </p>
        <p>
          We never display your password, and we do not publish your email
          address or phone number on public pages.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    heading: "Sharing and third-party service providers",
    body: (
      <>
        <p>
          We do not sell or rent your personal information. We share it only in
          the limited circumstances below.
        </p>
        <p>
          <strong>Service providers acting on our behalf.</strong> We use trusted
          third parties to run the Platform, and they only process your
          information on our instructions:
        </p>
        <ul>
          <li>
            <strong>Image hosting.</strong> Property photographs you upload are
            stored with Cloudinary, our image hosting provider, so they can be
            delivered to visitors.
          </li>
          <li>
            <strong>Transactional email.</strong> Emails such as your OTP and
            connection-request notifications are delivered through our email
            service provider.
          </li>
        </ul>
        <p>
          <strong>Other users</strong>, as described in{" "}
          <a href="#listing-visibility">What other users can see</a>.
        </p>
        <p>
          <strong>Legal and safety reasons.</strong> We may disclose information
          where we are required to by law, valid legal process, or a competent
          authority, or where we believe disclosure is necessary to protect the
          rights, property, or safety of {SITE_NAME}, our users, or the public.
        </p>
        <p>
          <strong>Business transfers.</strong> If {SITE_NAME} is involved in a
          merger, acquisition, or sale of assets, your information may be
          transferred as part of that transaction. We will notify you of any such
          change and your choices.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    heading: "How long we keep your information",
    body: (
      <>
        <p>
          We keep your personal information for as long as your account is active
          and as long as needed to provide the Platform and meet our legal
          obligations.
        </p>
        <p>
          When you delete your account, we delete your account record, your
          listings, your saved properties, your connection requests, and the
          associated property images from our image host — except where we must
          retain certain records to comply with the law, resolve disputes, or
          prevent fraud. Where retention is required, we keep the minimum
          necessary and restrict access to it.
        </p>
      </>
    ),
  },
  {
    id: "security",
    heading: "How we protect your information",
    body: (
      <>
        <p>
          We use appropriate technical and organisational measures to protect
          your personal information, including hashing passwords, issuing
          time-limited OTPs for email verification, and restricting access to
          account data to those who need it.
        </p>
        <p>
          No method of transmission or storage is completely secure, so we cannot
          guarantee absolute security. If we become aware of a breach that
          affects your personal information, we will notify you and the relevant
          authority as required by the NDPA.
        </p>
        <p>
          You play an important part too: keep your password confidential and
          tell us immediately at {SUPPORT_EMAIL} if you suspect your account has
          been compromised.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights and choices",
    body: (
      <>
        <p>
          Subject to the NDPA, you have the right to:
        </p>
        <ul>
          <li>access a copy of the personal information we hold about you;</li>
          <li>correct information that is inaccurate or incomplete;</li>
          <li>request deletion of your personal information;</li>
          <li>object to or request that we restrict certain processing;</li>
          <li>withdraw consent at any time, where we rely on consent, and</li>
          <li>lodge a complaint with the Nigeria Data Protection Commission.</li>
        </ul>
        <p>
          You can update most of your details directly through your dashboard
          profile settings, and you can delete your account there. For any other
          request, email us at {SUPPORT_EMAIL} or message us on WhatsApp at{" "}
          {WHATSAPP_DISPLAY}. We will respond within the timeframe required by
          law, and we may ask you to verify your identity before acting on a
          request.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies and local storage",
    body: (
      <>
        <p>
          We use essential storage on your device to keep you signed in and to
          remember your authentication state between visits. Without it, the
          Platform cannot tell that you are logged in.
        </p>
        <p>
          We do not use advertising cookies or sell data collected through them.
          You can clear stored data through your browser settings at any time,
          though you will be signed out as a result.
        </p>
      </>
    ),
  },
  {
    id: "children",
    heading: "Children",
    body: (
      <>
        <p>
          The Platform is intended for adults and is not directed at anyone under
          18. We do not knowingly collect personal information from children. If
          you believe a child has provided us with personal information, please
          contact us at {SUPPORT_EMAIL} and we will delete it.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or the law. When we make material changes, we will
          notify you by email or by notice on the Platform and update the "Last
          updated" date at the top of this page.
        </p>
        <p>
          Continuing to use the Platform after an update takes effect means you
          accept the revised policy.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    heading: "How to contact us",
    body: (
      <>
        <p>
          For any question about this Privacy Policy, or to exercise your data
          protection rights, contact our team:
        </p>
        <ul>
          <li>
            Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </li>
          <li>WhatsApp: {WHATSAPP_DISPLAY}</li>
          <li>Jurisdiction: {LEGAL_JURISDICTION}</li>
        </ul>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      kicker="Privacy"
      title="Privacy Policy"
      intro={`How ${SITE_NAME} collects, uses, and protects your personal information — written to be read, not skimmed past.`}
      sections={SECTIONS}
    />
  );
}
