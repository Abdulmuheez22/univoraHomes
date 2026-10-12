import { Link } from "react-router-dom";
import LegalLayout from "./LegalLayout";
import { LEGAL_JURISDICTION, SITE_NAME, SUPPORT_EMAIL } from "../../lib/site";

const SECTIONS = [
  {
    id: "acceptance",
    heading: "Acceptance of these Terms",
    body: (
      <>
        <p>
          These Terms of Service ("Terms") form a binding agreement between you
          and {SITE_NAME} ("we", "us", "our") governing your access to and use of
          the {SITE_NAME} website, applications, and services (together, the
          "Platform").
        </p>
        <p>
          By creating an account, ticking the acceptance box at sign-up, or
          otherwise using the Platform, you confirm that you have read,
          understood, and agreed to be bound by these Terms and by our{" "}
          <Link to="/privacy">Privacy Policy</Link>. If you do not agree, you must
          not use the Platform.
        </p>
        <p>
          You must be at least 18 years old and legally capable of entering into
          binding contracts to use the Platform.
        </p>
      </>
    ),
  },
  {
    id: "what-univora-does",
    heading: "What Univora Homes does",
    body: (
      <>
        <p>
          {SITE_NAME} is a listing and connection platform. We let landlords and
          agents publish property listings, and we let tenants and other seekers
          browse, save, and express interest in those listings.
        </p>
        <p>
          <strong>
            We are not a real estate agency, a broker, a party to any tenancy
            agreement, or a payment processor.
          </strong>{" "}
          We do not own, inspect, manage, or take possession of any property
          listed on the Platform, we do not collect rent or any other payment
          from tenants, and we are not responsible for any transaction, tenancy,
          or dispute between users.
        </p>
        <p>
          Any introduction, negotiation, inspection, or agreement you enter into
          with another user is strictly between you and that user. You are solely
          responsible for satisfying yourself as to the identity, authority, and
          credibility of anyone you deal with.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    heading: "Accounts, roles, and verification",
    body: (
      <>
        <p>
          You must register an account to publish listings or save and act on
          them. When you register you select a role — landlord, tenant, or agent.
          You must select the role that accurately describes you and must not
          impersonate another person or misrepresent your authority over a
          property.
        </p>
        <p>
          Registration requires a one-time password (OTP) sent to the email
          address you provide. You agree to:
        </p>
        <ul>
          <li>provide accurate, current, and complete information;</li>
          <li>
            keep your password confidential and not share your account with
            anyone else;
          </li>
          <li>
            keep your email address and phone number up to date, and
          </li>
          <li>
            notify us immediately at {SUPPORT_EMAIL} if you suspect any
            unauthorised use of your account.
          </li>
        </ul>
        <p>
          You are responsible for all activity that occurs under your account. We
          may suspend or terminate any account that contains false information,
          fails verification, or breaches these Terms.
        </p>
      </>
    ),
  },
  {
    id: "listings",
    heading: "Property listings",
    body: (
      <>
        <p>
          If you publish a listing, you confirm that you are the owner of the
          property or are duly authorised to advertise it, and that all details
          you provide — including the property name, type, address, city, state,
          category, description, and target rent — are accurate and not
          misleading.
        </p>
        <p>You must not publish a listing that:</p>
        <ul>
          <li>advertises a property you have no right to advertise;</li>
          <li>is already let, unavailable, or materially different from reality;</li>
          <li>
            contains false, discriminatory, defamatory, obscene, or unlawful
            content;
          </li>
          <li>
            includes images you do not own or have permission to use, or
          </li>
          <li>offers a property that does not legally exist.</li>
        </ul>
        <p>
          We do not verify listings or the ownership of any property. We may, but
          are not obliged to, review, edit, refuse, or remove any listing at our
          discretion — including where we believe it breaches these Terms or
          applicable law.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    body: (
      <>
        <p>You agree not to use the Platform to:</p>
        <ul>
          <li>
            break any applicable law, including the {LEGAL_JURISDICTION}'s
            laws on property, tenancy, consumer protection, and data protection;
          </li>
          <li>
            defraud, mislead, or cause loss to any other user, including by
            posting fake listings or demanding fees for a property that does not
            exist or is not yours to offer;
          </li>
          <li>
            harass, threaten, or discriminate against any person or group;
          </li>
          <li>
            scrape, crawl, copy, or republish listings, images, or user data from
            the Platform, or use the Platform to build a competing service;
          </li>
          <li>
            upload malware, attempt to gain unauthorised access to the Platform
            or its users' accounts, or interfere with the Platform's normal
            operation;
          </li>
          <li>
            impersonate {SITE_NAME}, our staff, or any other user, or
          </li>
          <li>use another user's contact details for unsolicited marketing.</li>
        </ul>
        <p>
          We may investigate and take any action we consider appropriate against
          misuse, including removing content, suspending or terminating your
          account, and reporting you to law enforcement.
        </p>
      </>
    ),
  },
  {
    id: "connections",
    heading: "Saving properties and connection requests",
    body: (
      <>
        <p>
          The Platform allows tenants to save properties and to send a connection
          request to a landlord or agent about a specific listing. Sending a
          request lets that landlord or agent contact you regarding that
          property.
        </p>
        <p>
          A request is not a tenancy agreement, an offer, or a reservation. A
          landlord or agent is free to accept or decline any request, and we do
          not guarantee any response, inspection, or outcome.
        </p>
        <p>
          <strong>
            Never send money to anyone you have not verified.
          </strong>{" "}
          You should inspect a property, confirm ownership, and obtain proper
          documentation before making any payment or commitment, and you should
          not transmit funds through the Platform. Any loss arising from a
          payment you choose to make to another user is your own.
        </p>
      </>
    ),
  },
  {
    id: "your-content",
    heading: "Your content and licence to us",
    body: (
      <>
        <p>
          You retain ownership of the content you submit to the Platform —
          including listings, descriptions, and photographs ("Your Content").
        </p>
        <p>
          By submitting Your Content, you grant {SITE_NAME} a non-exclusive,
          worldwide, royalty-free licence to host, store, reproduce, resize,
          adapt, and display Your Content solely to operate, provide, and promote
          the Platform. This licence ends when you delete Your Content or your
          account, except for copies retained in backups for a reasonable period
          or where retention is required by law.
        </p>
        <p>
          You are solely responsible for Your Content and confirm you hold all
          rights necessary to grant this licence.
        </p>
      </>
    ),
  },
  {
    id: "our-content",
    heading: "Our intellectual property",
    body: (
      <>
        <p>
          The Platform itself — including its name, logo, design, text,
          software, and underlying code — is owned by or licensed to{" "}
          {SITE_NAME} and is protected by applicable intellectual property laws.
        </p>
        <p>
          We grant you a limited, revocable, non-transferable licence to use the
          Platform for its intended purpose in accordance with these Terms. You
          may not copy, modify, distribute, sell, or reverse-engineer any part of
          the Platform without our prior written consent.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    heading: "Availability and changes to the Platform",
    body: (
      <>
        <p>
          We aim to keep the Platform available, but we provide it on an "as is"
          and "as available" basis. We do not warrant that it will be
          uninterrupted, timely, secure, or free of errors, or that listings will
          be accurate or current.
        </p>
        <p>
          We may change, suspend, or discontinue any part of the Platform at any
          time, and may modify these Terms. If we make material changes, we will
          give reasonable notice — for example by email or by notice on the
          Platform. Continuing to use the Platform after changes take effect
          means you accept the updated Terms.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer",
    heading: "Disclaimers and limitation of liability",
    body: (
      <>
        <p>
          To the fullest extent permitted by applicable law, and because we do
          not verify users or listings, {SITE_NAME} is not liable for:
        </p>
        <ul>
          <li>
            the accuracy, legality, or quality of any listing, or any property's
            condition, safety, or suitability;
          </li>
          <li>
            the conduct of any user, including fraud, misrepresentation, or
            failure to honour an arrangement;
          </li>
          <li>
            any loss of money, data, profits, or goodwill arising from your use
            of the Platform, or
          </li>
          <li>any indirect, incidental, or consequential loss.</li>
        </ul>
        <p>
          Where liability cannot be excluded, our total liability to you for any
          claim arising out of or relating to the Platform is limited to the
          greater of ₦10,000 or the total amount you paid us in the twelve
          months before the claim. Nothing in these Terms limits any liability
          that cannot lawfully be limited.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    heading: "Suspension and termination",
    body: (
      <>
        <p>
          You may stop using the Platform and delete your account at any time via
          your dashboard settings.
        </p>
        <p>
          We may suspend or terminate your access, with or without notice, if we
          reasonably believe you have breached these Terms, if required by law,
          or to protect the Platform or other users. On termination, your right
          to use the Platform ends immediately. Sections covering content
          licences, disclaimers, liability, and governing law survive
          termination.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing law and disputes",
    body: (
      <>
        <p>
          These Terms are governed by the laws of the {LEGAL_JURISDICTION}.
        </p>
        <p>
          We'd much rather resolve issues directly, so before bringing a formal
          claim, please contact us at {SUPPORT_EMAIL} and allow us 30 days to
          respond. If we cannot resolve the matter, the courts of the{" "}
          {LEGAL_JURISDICTION} have exclusive jurisdiction over any dispute.
        </p>
        <p>
          If any provision of these Terms is found to be unenforceable, the
          remaining provisions stay in full force. Our failure to enforce a
          provision is not a waiver of it. These Terms, together with the{" "}
          <Link to="/privacy">Privacy Policy</Link>, are the entire agreement
          between you and us regarding the Platform.
        </p>
      </>
    ),
  },
];

export default function TermsOfService() {
  return (
    <LegalLayout
      kicker="Legal"
      title="Terms of Service"
      intro={`The rules for using ${SITE_NAME} — for landlords and agents publishing listings, and for tenants browsing and connecting with them. Please read them carefully before you agree.`}
      sections={SECTIONS}
    />
  );
}
