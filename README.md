Onyx AI Business Handler
An AI-powered business assistant platform for repetitive
client-management work.
Onyx AI Business Handler is a SaaS project in development, designed to
help businesses and independent professionals reduce time spent on
routine administrative tasks. The goal is to let users focus on their
work while AI-assisted workflows help with follow-ups, communication,
and task organisation.
Project status: In development. Features and setup instructions
may change as the project evolves.

Overview
Small businesses and professionals---such as chartered accountants
(CAs), consultants, and service providers---often manage many
client-related tasks manually. Writing emails, following up on pending
payments, requesting documents, and keeping track of next steps can take
valuable time.
Onyx aims to make these workflows easier through AI-assisted business
handling, with a central platform owner and separate client-facing
workspaces.
Intended Platform Model
Master domain
The master side is intended for the platform owner, who operates and
maintains the service. The platform is designed around a centrally
managed AI API key, rather than requiring every client to configure
their own key.
Client domain
The client side is intended for businesses and independent professionals
who manage their own customers. Each client uses the platform to help
organise and carry out repetitive administrative work.
The intended model is multi-tenant: different client organisations
should have their own separated workspaces and data. Tenant isolation
and access controls must be enforced by the application before the
service is used with real customer information.
Intended Use Cases
The product direction includes AI-assisted workflows such as:
- Email drafting --- prepare professional messages for client
  communication.
- Payment reminders --- help prepare follow-ups for outstanding
  payments.
- Document follow-ups --- draft requests and reminders for pending
  documents.
- Task scheduling --- help organise follow-ups and upcoming
  actions.
- Other routine tasks --- support additional repetitive business
  workflows as the product develops.
These are intended use cases, not a guarantee that every workflow is
already implemented. Availability depends on the current application
state.
Business Model
Onyx is planned as a subscription-based SaaS, with clients paying a
recurring monthly fee for access to and maintenance of the service.
Subscription plans, billing, usage limits, and payment processing should
be documented here once they are implemented and finalised.
Repository Structure
The repository currently includes these top-level project areas:
.
├── onyx-backend/
├── onyx-client/
├── onyx-master/
└── docker-compose.yml
The exact responsibilities and internal structure of each component
should be confirmed against the current source code as development
progresses.
Technology Stack
The technology stack is intentionally not listed here yet. Add the
confirmed languages, frameworks, database, AI provider, and
infrastructure after verifying them in the source code and project
configuration.
Getting Started
Onyx is currently under development. Verified installation and run
instructions have not yet been documented.
Once the setup process is stable, this section should include:
1. Prerequisites and supported runtime versions.
2. Repository cloning instructions.
3. Environment variable configuration.
4. Dependency installation steps.
5. Database setup and migrations, if applicable.
6. Commands to run the master, client, and backend components.
7. Instructions for running the application with Docker Compose, if
   supported by the current configuration.
Configuration and API keys
The intended model uses a centrally managed AI API key controlled by the
platform owner. Keep secrets in environment variables or an appropriate
secrets manager.
- Never commit API keys, passwords, tokens, or production
  credentials to Git.
- Provide a safe example configuration file (such as .env.example)
  with placeholder values only.
- Ensure the master API key is never exposed to client-side code or
  returned to client users.
- Apply authentication, authorisation, usage controls, and
  tenant-level data isolation before handling real client data.
Actual environment variable names and configuration steps should be
documented after checking the implementation.
Development Principles
As the project develops, important areas to address include:
- Tenant isolation: prevent one client organisation from accessing
  another organisation's data.
- Credential security: keep privileged keys on the server side.
- Human oversight: allow review of AI-generated communications
  before sending them externally, unless a carefully controlled
  automation flow is explicitly implemented.
- Reliable scheduling: handle time zones, retries, duplicate
  reminders, and task failures safely.
- Privacy: minimise stored client data and protect sensitive
  business documents and communications.
- Transparency: clearly communicate which actions are drafted,
  scheduled, or actually completed.
These are development considerations and should not be interpreted as
confirmation that every safeguard is already implemented.
Roadmap
The following areas represent product goals, not a statement of
completed functionality:
- Develop the master and client experiences.
- Build reliable AI-assisted workflows for emails and follow-ups.
- Support scheduling and tracking routine tasks.
- Strengthen tenant separation, authentication, and access control.
- Define subscription plans and monthly billing.
- Document deployment, monitoring, and operational maintenance.
Contributing
Onyx is under active development. If you would like to contribute, open
an issue to discuss a proposed change before submitting a pull request.
Contribution guidelines may be added as the project matures.
License
No license is specified in this README. Add a LICENSE file and update
this section once the project's licensing terms have been decided.
Onyx AI Business Handler --- less repetitive administration, more
time for meaningful work.
