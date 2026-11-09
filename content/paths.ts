/**
 * Career paths.
 *
 * Each path is an ordered list of stages, from the very first foundation to job-ready.
 * Stages reference lessons from content/curriculum.ts — lessons are written ONCE and
 * shared between paths, so finishing "Linux" on one path also counts on every other path.
 *
 * Item formats:
 *   "track/module"            → every lesson in that module, in curriculum order
 *   "track/module/lesson"     → one lesson
 * If a lesson appears in several stages of the same path, only its first appearance is kept.
 */

export interface PathStageDef {
  title: string;
  summary: string;
  items: string[];
  optional?: boolean;
}

export interface PathDef {
  slug: string;
  title: string;
  /** One sentence on what the job is. */
  role: string;
  /** Short line for cards. */
  tagline: string;
  /** Who should pick this path. */
  forWho: string;
  /** What you can do at the end. */
  outcomes: string[];
  mark: string;
  stages: PathStageDef[];
}

/* Shared building blocks */
const PY_CORE = [
  "python/python-basics",
  "python/python-data-structures",
  "python/python-functions",
  "python/python-files-errors",
  "python/python-environment",
];

export const paths: PathDef[] = [
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "full-stack-developer",
    title: "Full-Stack Developer",
    role: "Builds complete web applications — the interface users see, the APIs and servers behind it, and the database underneath.",
    tagline: "Frontend, backend, databases and deployment — build complete web apps.",
    forWho: "You want to build websites and web apps end to end, freelance for clients, or join a product team as a developer.",
    outcomes: [
      "Build responsive, accessible interfaces with HTML, CSS, React and Next.js",
      "Design and build REST APIs with Node.js, Express, NestJS or Python",
      "Model data in PostgreSQL and MongoDB, with authentication and authorization",
      "Write tests, secure your app against the OWASP Top 10 and deploy it to production",
    ],
    mark: "#2f5d8a",
    stages: [
      {
        title: "How computers and the web work",
        summary: "What happens inside a computer and between a browser and a server.",
        items: [
          "foundations/how-computers-work",
          "foundations/networking/ip-addresses-subnets-and-cidr",
          "foundations/networking/ports-tcp-and-udp",
          "foundations/networking/dns-how-names-become-addresses",
          "foundations/networking/http-and-https-in-depth",
          "foundations/networking/tls-and-certificates",
        ],
      },
      {
        title: "Developer tools: terminal and Git",
        summary: "The command line and version control every developer uses daily.",
        items: [
          "foundations/linux/what-linux-is-and-why-it-runs-the-internet",
          "foundations/linux/navigating-the-terminal",
          "foundations/linux/working-with-files-and-directories",
          "foundations/linux/file-permissions-and-ownership",
          "foundations/linux/environment-variables-and-the-path",
          "foundations/linux/ssh-and-key-based-authentication",
          "foundations/git",
          "foundations/data-formats/json",
          "foundations/data-formats/yaml",
          "foundations/data-formats/toml-ini-and-env-files",
          "foundations/data-formats/regular-expressions",
        ],
      },
      { title: "HTML", summary: "Structure and meaning of web pages.", items: ["full-stack/html"] },
      { title: "CSS", summary: "Layout, responsive design and Tailwind.", items: ["full-stack/css"] },
      { title: "JavaScript", summary: "The language of the web, from variables to the event loop.", items: ["full-stack/javascript"] },
      { title: "TypeScript", summary: "Types that catch bugs before users do.", items: ["full-stack/typescript"] },
      { title: "The browser and Web APIs", summary: "Rendering, the DOM, fetch, storage and CORS.", items: ["full-stack/browser"] },
      { title: "React", summary: "Components, state and hooks.", items: ["full-stack/react"] },
      { title: "Next.js", summary: "The full-stack React framework.", items: ["full-stack/nextjs"] },
      {
        title: "Backend with Node.js and Express",
        summary: "JavaScript on the server and your first APIs.",
        items: ["full-stack/nodejs", "full-stack/express"],
      },
      { title: "API design", summary: "REST, status codes, GraphQL, WebSockets, webhooks.", items: ["full-stack/apis"] },
      { title: "NestJS", summary: "Structured, large-scale TypeScript backends.", items: ["full-stack/nestjs"] },
      { title: "Databases", summary: "SQL, PostgreSQL, MongoDB, Redis and ORMs.", items: ["full-stack/databases"] },
      { title: "Authentication and authorization", summary: "Sessions, JWT, OAuth, RBAC and multi-tenancy.", items: ["full-stack/auth"] },
      {
        title: "Python for web development",
        summary: "A second backend language: Python, Django and FastAPI.",
        optional: true,
        items: [...PY_CORE, "python/python-oop", "python/python-django", "python/python-web"],
      },
      { title: "Testing", summary: "Unit, integration and end-to-end tests.", items: ["full-stack/testing"] },
      { title: "Web security for developers", summary: "OWASP Top 10 from the developer's side.", items: ["full-stack/web-security-for-devs"] },
      { title: "Performance and architecture", summary: "Fast apps and systems that scale.", items: ["full-stack/performance"] },
      {
        title: "Deployment and DevOps basics",
        summary: "Get your app online and keep it running.",
        items: [
          "full-stack/deployment",
          "devops/docker/containers-vs-virtual-machines",
          "devops/docker/writing-a-dockerfile",
          "devops/docker/multi-stage-builds",
          "devops/docker/docker-compose",
          "devops/ci-cd/continuous-integration",
          "devops/ci-cd/github-actions-in-depth",
          "foundations/linux/systemd-and-services",
          "foundations/linux/logs-and-journalctl",
        ],
      },
      {
        title: "Get hired",
        summary: "Portfolio, resume and interviews.",
        items: [
          "career/portfolio",
          "career/interviews/resume-and-linkedin-for-tech-roles",
          "career/interviews/full-stack-interview-questions",
          "career/interviews/system-design-interviews",
          "career/interviews/behavioural-interviews-star",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    role: "Builds and runs the platform software ships on — CI/CD pipelines, containers, Kubernetes, infrastructure as code and monitoring.",
    tagline: "Linux, automation, containers, CI/CD, Kubernetes and the cloud.",
    forWho: "You enjoy servers, automation and making deployments fast and reliable — or you want to move from development into operations.",
    outcomes: [
      "Administer Linux servers and automate them with Bash and Python",
      "Containerise applications and run them on Kubernetes",
      "Build CI/CD pipelines and manage infrastructure with Terraform and Ansible",
      "Monitor systems with Prometheus and Grafana and run them reliably in AWS",
    ],
    mark: "#3d7a5a",
    stages: [
      { title: "How computers work", summary: "CPU, memory, processes, files and the client–server model.", items: ["foundations/how-computers-work"] },
      { title: "Linux", summary: "The operating system of servers, containers and the cloud.", items: ["foundations/linux"] },
      { title: "Bash scripting", summary: "Automate anything you can type.", items: ["foundations/shell-scripting"] },
      { title: "Networking", summary: "IP, DNS, HTTP, TLS, load balancers and firewalls.", items: ["foundations/networking"] },
      { title: "Git and GitHub", summary: "Version control for code and infrastructure.", items: ["foundations/git"] },
      { title: "Data formats", summary: "JSON, YAML, TOML and regex — the language of configs.", items: ["foundations/data-formats"] },
      { title: "Python for automation", summary: "Scripts, APIs and boto3.", items: [...PY_CORE, "python/python-automation"] },
      {
        title: "How applications are built and served",
        summary: "Enough development knowledge to run other people's apps well.",
        items: [
          "full-stack/nodejs/how-nodejs-works",
          "full-stack/nodejs/npm-packagejson-and-lockfiles",
          "full-stack/apis/rest-api-design",
          "full-stack/apis/http-status-codes",
          "full-stack/deployment",
          "full-stack/performance/caching-layers-browser-cdn-server-db",
          "full-stack/performance/monolith-vs-microservices",
          "full-stack/performance/message-queues-and-event-driven-design",
        ],
      },
      { title: "DevOps culture", summary: "What DevOps is and how delivery is measured.", items: ["devops/devops-culture"] },
      { title: "Docker and containers", summary: "Package once, run anywhere.", items: ["devops/docker"] },
      { title: "CI/CD", summary: "Automated build, test and release.", items: ["devops/ci-cd"] },
      { title: "Kubernetes", summary: "Running containers at scale.", items: ["devops/kubernetes"] },
      { title: "Infrastructure as Code", summary: "Terraform and Ansible.", items: ["devops/iac"] },
      { title: "Cloud with AWS", summary: "Core services, serverless and containers on AWS.", items: ["cloud/cloud-concepts", "cloud/aws-core", "cloud/aws-advanced"] },
      { title: "GitOps", summary: "Git as the source of truth for what runs.", items: ["devops/gitops"] },
      { title: "Observability", summary: "Logs, metrics, traces and alerts.", items: ["devops/observability"] },
      { title: "Site Reliability Engineering", summary: "SLOs, incidents and reliability.", items: ["devops/sre"] },
      {
        title: "Security for DevOps",
        summary: "The DevSecOps essentials every DevOps engineer needs.",
        items: [
          "devsecops/devsecops-foundations",
          "devsecops/supply-chain/securing-cicd-pipelines",
          "devsecops/code-security/secrets-detection-gitleaks-trufflehog",
          "devsecops/container-security/minimal-and-distroless-images",
          "devsecops/container-security/image-scanning-with-trivy-and-grype",
          "devsecops/container-security/running-as-non-root-and-dropping-capabilities",
        ],
      },
      {
        title: "Get hired",
        summary: "Certifications, portfolio and interviews.",
        items: [
          "career/certifications/certification-roadmap",
          "career/certifications/aws-solutions-architect-associate",
          "career/certifications/certified-kubernetes-administrator-cka",
          "career/portfolio",
          "career/interviews/resume-and-linkedin-for-tech-roles",
          "career/interviews/devops-and-cloud-interview-questions",
          "career/interviews/system-design-interviews",
          "career/interviews/behavioural-interviews-star",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "cloud-engineer",
    title: "Cloud Engineer",
    role: "Designs, builds and operates infrastructure on AWS, Azure and Google Cloud — networks, compute, storage and managed services.",
    tagline: "AWS first, then Azure and GCP — design and run cloud infrastructure.",
    forWho: "You want to design and run systems in the cloud, and aim for AWS certifications and cloud-focused roles.",
    outcomes: [
      "Design secure VPC networks and deploy compute, storage and databases on AWS",
      "Build serverless and container-based architectures",
      "Manage everything as code with Terraform",
      "Map your AWS knowledge to Azure and GCP, and control cost",
    ],
    mark: "#b5762a",
    stages: [
      { title: "How computers work", summary: "The machine underneath every cloud instance.", items: ["foundations/how-computers-work"] },
      {
        title: "Linux essentials",
        summary: "Enough Linux to run and debug cloud servers.",
        items: [
          "foundations/linux/what-linux-is-and-why-it-runs-the-internet",
          "foundations/linux/distributions-and-package-managers",
          "foundations/linux/the-linux-file-system-hierarchy",
          "foundations/linux/navigating-the-terminal",
          "foundations/linux/working-with-files-and-directories",
          "foundations/linux/users-groups-and-sudo",
          "foundations/linux/file-permissions-and-ownership",
          "foundations/linux/processes-and-signals",
          "foundations/linux/systemd-and-services",
          "foundations/linux/logs-and-journalctl",
          "foundations/linux/disk-mounts-and-storage",
          "foundations/linux/environment-variables-and-the-path",
          "foundations/linux/ssh-and-key-based-authentication",
          "foundations/linux/hardening-a-linux-server",
        ],
      },
      {
        title: "Bash essentials",
        summary: "Scripting for the AWS CLI and server automation.",
        items: [
          "foundations/shell-scripting/your-first-bash-script-shebang-chmod-x-running-scripts",
          "foundations/shell-scripting/pipes-redirection-and-streams",
          "foundations/shell-scripting/grep-sed-and-awk",
          "foundations/shell-scripting/bash-variables-and-quoting",
          "foundations/shell-scripting/conditionals-and-test-expressions",
          "foundations/shell-scripting/loops-for-while-until",
          "foundations/shell-scripting/functions-and-script-arguments",
          "foundations/shell-scripting/writing-safe-scripts-set-euo-pipefail",
          "foundations/shell-scripting/working-with-json-using-jq",
        ],
      },
      { title: "Networking", summary: "The foundation of every VPC design.", items: ["foundations/networking"] },
      { title: "Git and data formats", summary: "Version control, JSON and YAML.", items: ["foundations/git", "foundations/data-formats"] },
      { title: "Python for cloud automation", summary: "Scripts and boto3.", items: [...PY_CORE, "python/python-automation"] },
      { title: "Cloud concepts", summary: "Service models, regions, shared responsibility and pricing.", items: ["cloud/cloud-concepts"] },
      { title: "AWS core services", summary: "IAM, EC2, S3, VPC, RDS, Route 53, CloudWatch and more.", items: ["cloud/aws-core"] },
      { title: "AWS advanced", summary: "Serverless, containers and multi-account setups.", items: ["cloud/aws-advanced"] },
      { title: "Infrastructure as Code", summary: "Terraform and Ansible.", items: ["devops/iac"] },
      {
        title: "Containers on the cloud",
        summary: "Docker and Kubernetes basics for ECS and EKS.",
        items: ["devops/docker", "devops/kubernetes"],
      },
      {
        title: "CI/CD for infrastructure",
        summary: "Automate deployments safely.",
        items: [
          "devops/ci-cd/continuous-integration",
          "devops/ci-cd/continuous-delivery-vs-deployment",
          "devops/ci-cd/github-actions-in-depth",
          "devops/ci-cd/deployment-strategies-blue-green-canary-rolling",
          "devops/iac/terraform-workflows-in-ci",
        ],
      },
      { title: "Cloud architecture", summary: "Well-Architected, high availability, DR and cost.", items: ["cloud/cloud-architecture"] },
      { title: "Azure and Google Cloud", summary: "Map what you know to the other two clouds.", items: ["cloud/azure-gcp"] },
      {
        title: "Observability",
        summary: "Know what your infrastructure is doing.",
        items: ["devops/observability", "devops/sre/slis-slos-and-error-budgets"],
      },
      {
        title: "Cloud security essentials",
        summary: "Identity, encryption and logging every cloud engineer must get right.",
        items: [
          "cloud-security/cloud-security-foundations",
          "cloud-security/cloud-iam",
          "cloud-security/data-protection",
          "cloud-security/detection-response/cloudtrail",
          "cloud-security/detection-response/guardduty",
        ],
      },
      {
        title: "Get hired",
        summary: "AWS certification, portfolio and interviews.",
        items: [
          "career/certifications/certification-roadmap",
          "career/certifications/aws-solutions-architect-associate",
          "career/portfolio",
          "career/interviews/resume-and-linkedin-for-tech-roles",
          "career/interviews/devops-and-cloud-interview-questions",
          "career/interviews/system-design-interviews",
          "career/interviews/behavioural-interviews-star",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "cyber-security-analyst",
    title: "Cyber Security Analyst",
    role: "Protects organisations by understanding attacks, monitoring for threats, testing defences and responding to incidents.",
    tagline: "Networks, attacks, detection and response — offense and defense.",
    forWho: "You want to work in a SOC, in penetration testing or in security engineering, or you studied cyber security and want job-ready depth.",
    outcomes: [
      "Explain and recognise common network, web and identity attacks",
      "Use Wireshark, Nmap, Burp Suite and a SIEM",
      "Perform structured web application testing and write a report",
      "Detect, triage and respond to incidents, and speak the language of risk and compliance",
    ],
    mark: "#9b3d3d",
    stages: [
      { title: "How computers work", summary: "Processes, memory, files and encoding — what attackers abuse.", items: ["foundations/how-computers-work"] },
      { title: "Networking", summary: "The single most important foundation for security.", items: ["foundations/networking"] },
      { title: "Linux", summary: "Every security tool and most servers you defend run on it.", items: ["foundations/linux"] },
      {
        title: "Bash for security work",
        summary: "Log analysis and automation from the command line.",
        items: [
          "foundations/shell-scripting/your-first-bash-script-shebang-chmod-x-running-scripts",
          "foundations/shell-scripting/pipes-redirection-and-streams",
          "foundations/shell-scripting/grep-sed-and-awk",
          "foundations/shell-scripting/find-xargs-and-text-processing",
          "foundations/shell-scripting/bash-variables-and-quoting",
          "foundations/shell-scripting/conditionals-and-test-expressions",
          "foundations/shell-scripting/loops-for-while-until",
          "foundations/shell-scripting/working-with-json-using-jq",
          "foundations/shell-scripting/practical-scripts-backups-log-analysis-and-health-checks",
        ],
      },
      { title: "Cryptography basics", summary: "Hashing, encryption, signatures and PKI.", items: ["foundations/crypto-basics"] },
      { title: "Git and data formats", summary: "Version control, JSON, YAML, regex and encodings.", items: ["foundations/git", "foundations/data-formats"] },
      { title: "Python for security", summary: "Write your own tools.", items: [...PY_CORE, "python/python-automation/calling-apis-with-requests-and-httpx", "python/python-automation/parsing-logs-at-scale", "python/python-security"] },
      {
        title: "How web applications work",
        summary: "You cannot attack or defend what you do not understand.",
        items: [
          "full-stack/html/document-structure",
          "full-stack/html/forms-and-inputs",
          "full-stack/javascript/how-javascript-runs-browser-nodejs-and-the-console",
          "full-stack/browser",
          "full-stack/apis/rest-api-design",
          "full-stack/apis/http-status-codes",
          "full-stack/auth",
          "full-stack/databases/relational-vs-non-relational",
          "full-stack/databases/sql-basics",
        ],
      },
      { title: "Security fundamentals", summary: "CIA, risk, controls, zero trust and MITRE ATT&CK.", items: ["cyber-security/security-fundamentals"] },
      { title: "Network security", summary: "Attacks, firewalls, IDS/IPS, Wireshark and Nmap.", items: ["cyber-security/network-security"] },
      { title: "Identity and access", summary: "MFA, SSO, Active Directory and privileged access.", items: ["cyber-security/identity"] },
      {
        title: "Web application security",
        summary: "OWASP Top 10 and hands-on testing with Burp.",
        items: ["full-stack/web-security-for-devs", "cyber-security/web-app-security"],
      },
      { title: "Offensive security", summary: "Recon, exploitation, privilege escalation and reporting.", items: ["cyber-security/offensive"] },
      { title: "Defensive security and SOC", summary: "Logs, SIEM, detections, EDR and threat hunting.", items: ["cyber-security/defensive"] },
      { title: "Incident response and forensics", summary: "What to do when something goes wrong.", items: ["cyber-security/incident-response"] },
      { title: "Threat modeling", summary: "Find design flaws before attackers do.", items: ["cyber-security/threat-modeling"] },
      { title: "Governance, risk and compliance", summary: "Policies, frameworks and audits.", items: ["cyber-security/grc"] },
      {
        title: "Cloud security introduction",
        summary: "Where most systems now live.",
        items: [
          "cloud/cloud-concepts/what-cloud-computing-is",
          "cloud/cloud-concepts/the-shared-responsibility-model",
          "cloud-security/cloud-security-foundations",
        ],
      },
      {
        title: "Get hired",
        summary: "Security+, portfolio and interviews.",
        items: [
          "career/certifications/certification-roadmap",
          "career/certifications/comptia-security",
          "career/portfolio",
          "career/interviews/resume-and-linkedin-for-tech-roles",
          "career/interviews/security-interview-questions",
          "career/interviews/behavioural-interviews-star",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "devsecops-engineer",
    title: "DevSecOps Engineer",
    role: "Builds security into the software delivery pipeline — scanning code, dependencies, containers and infrastructure automatically, without slowing teams down.",
    tagline: "Security built into CI/CD, containers, Kubernetes and the cloud.",
    forWho: "You know development or DevOps and want to specialise in security — or you studied security and want to work close to engineering teams.",
    outcomes: [
      "Design a secure SDLC and threat-model applications",
      "Add SAST, SCA, secrets scanning, DAST and IaC scanning to CI/CD",
      "Secure containers, Kubernetes clusters and the software supply chain",
      "Manage vulnerabilities end to end and build a complete secure pipeline",
    ],
    mark: "#6b4c8a",
    stages: [
      { title: "How computers work", summary: "The foundation under every system you secure.", items: ["foundations/how-computers-work"] },
      { title: "Linux", summary: "Servers, containers and CI runners all run it.", items: ["foundations/linux"] },
      { title: "Bash scripting", summary: "The glue of every pipeline.", items: ["foundations/shell-scripting"] },
      { title: "Networking", summary: "How services talk — and where they get attacked.", items: ["foundations/networking"] },
      { title: "Git and GitHub", summary: "Where the pipeline starts.", items: ["foundations/git"] },
      { title: "Data formats and cryptography", summary: "YAML, JSON, regex, hashing, keys and certificates.", items: ["foundations/data-formats", "foundations/crypto-basics"] },
      { title: "Python for automation and security", summary: "Write the glue and the checks.", items: [...PY_CORE, "python/python-automation", "python/python-security"] },
      {
        title: "How applications are built",
        summary: "Understand the code you are securing.",
        items: [
          "full-stack/javascript/how-javascript-runs-browser-nodejs-and-the-console",
          "full-stack/nodejs/how-nodejs-works",
          "full-stack/nodejs/npm-packagejson-and-lockfiles",
          "full-stack/apis/rest-api-design",
          "full-stack/apis/http-status-codes",
          "full-stack/auth",
          "full-stack/testing/why-test-the-testing-pyramid",
          "full-stack/web-security-for-devs",
        ],
      },
      {
        title: "Security fundamentals",
        summary: "The concepts every security decision rests on.",
        items: ["cyber-security/security-fundamentals", "cyber-security/threat-modeling", "cyber-security/web-app-security"],
      },
      {
        title: "DevOps core",
        summary: "The platform DevSecOps is built on.",
        items: ["devops/devops-culture", "devops/docker", "devops/ci-cd", "devops/kubernetes", "devops/iac", "devops/gitops", "devops/observability"],
      },
      { title: "Cloud basics", summary: "Where pipelines deploy to.", items: ["cloud/cloud-concepts", "cloud/aws-core"] },
      { title: "DevSecOps foundations", summary: "Shift left without slowing teams down.", items: ["devsecops/devsecops-foundations"] },
      { title: "Code security", summary: "SAST, SCA, secrets detection and secure code review.", items: ["devsecops/code-security"] },
      { title: "Dynamic testing", summary: "DAST, ZAP, API testing and fuzzing.", items: ["devsecops/dynamic-testing"] },
      { title: "Software supply chain security", summary: "SBOMs, signing, SLSA and securing CI/CD.", items: ["devsecops/supply-chain"] },
      { title: "Container security", summary: "Images, registries and runtime.", items: ["devsecops/container-security"] },
      { title: "Kubernetes security", summary: "RBAC, policies, secrets and admission control.", items: ["devsecops/kubernetes-security"] },
      { title: "IaC security and policy as code", summary: "Stop misconfigurations before they deploy.", items: ["devsecops/iac-security"] },
      { title: "Vulnerability management", summary: "From findings to fixes.", items: ["devsecops/vuln-management"] },
      {
        title: "Cloud security essentials",
        summary: "Identity and detection in the cloud.",
        items: ["cloud-security/cloud-iam", "cloud-security/detection-response/cloudtrail", "cloud-security/detection-response/guardduty"],
      },
      { title: "Capstone: build a secure pipeline", summary: "Put everything together end to end.", items: ["devsecops/devsecops-project"] },
      {
        title: "Get hired",
        summary: "Certifications, portfolio and interviews.",
        items: [
          "career/certifications/certification-roadmap",
          "career/certifications/comptia-security",
          "career/certifications/certified-kubernetes-administrator-cka",
          "career/certifications/certified-kubernetes-security-specialist-cks",
          "career/portfolio",
          "career/interviews/resume-and-linkedin-for-tech-roles",
          "career/interviews/devops-and-cloud-interview-questions",
          "career/interviews/security-interview-questions",
          "career/interviews/behavioural-interviews-star",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "cloud-security-engineer",
    title: "Cloud Security Engineer",
    role: "Secures cloud accounts, identities, networks, data and workloads — and proves it by detecting and responding to attacks in the cloud.",
    tagline: "IAM, data protection, detection, posture management and cloud attacks.",
    forWho: "You have (or are building) security and cloud fundamentals and want to specialise in securing AWS, Azure and GCP environments.",
    outcomes: [
      "Design least-privilege IAM and secure multi-account landing zones",
      "Protect data with encryption and key management, and secure cloud networks",
      "Build cloud detections and respond to cloud incidents",
      "Assess posture with CSPM tools and test cloud environments like an attacker",
    ],
    mark: "#2f6f73",
    stages: [
      { title: "How computers work", summary: "The machine under every cloud workload.", items: ["foundations/how-computers-work"] },
      { title: "Linux", summary: "Most cloud workloads run it.", items: ["foundations/linux"] },
      {
        title: "Bash essentials",
        summary: "CLI automation and log analysis.",
        items: [
          "foundations/shell-scripting/your-first-bash-script-shebang-chmod-x-running-scripts",
          "foundations/shell-scripting/pipes-redirection-and-streams",
          "foundations/shell-scripting/grep-sed-and-awk",
          "foundations/shell-scripting/bash-variables-and-quoting",
          "foundations/shell-scripting/conditionals-and-test-expressions",
          "foundations/shell-scripting/loops-for-while-until",
          "foundations/shell-scripting/functions-and-script-arguments",
          "foundations/shell-scripting/writing-safe-scripts-set-euo-pipefail",
          "foundations/shell-scripting/working-with-json-using-jq",
        ],
      },
      { title: "Networking", summary: "VPCs are networks — learn them first.", items: ["foundations/networking"] },
      { title: "Git, data formats and cryptography", summary: "JSON policies, YAML templates, keys and certificates.", items: ["foundations/git", "foundations/data-formats", "foundations/crypto-basics"] },
      { title: "Python for cloud security", summary: "boto3 automation and security tooling.", items: [...PY_CORE, "python/python-automation", "python/python-security"] },
      {
        title: "Security fundamentals",
        summary: "The concepts, identity, attacks and response basics.",
        items: [
          "cyber-security/security-fundamentals",
          "cyber-security/identity",
          "cyber-security/network-security",
          "cyber-security/threat-modeling",
          "cyber-security/incident-response",
          "full-stack/web-security-for-devs/owasp-top-10-overview",
          "cyber-security/web-app-security/server-side-request-forgery-ssrf",
        ],
      },
      { title: "Cloud concepts and AWS", summary: "The services you will be securing.", items: ["cloud/cloud-concepts", "cloud/aws-core", "cloud/aws-advanced"] },
      { title: "Cloud architecture", summary: "Secure-by-design architectures.", items: ["cloud/cloud-architecture"] },
      { title: "Azure and Google Cloud", summary: "The other two clouds.", items: ["cloud/azure-gcp"] },
      {
        title: "Infrastructure, containers and Kubernetes",
        summary: "How cloud workloads are built and deployed.",
        items: ["devops/iac", "devops/docker", "devops/kubernetes", "devops/ci-cd/github-actions-in-depth"],
      },
      { title: "Cloud security foundations", summary: "How the cloud changes security.", items: ["cloud-security/cloud-security-foundations"] },
      { title: "Cloud IAM deep dive", summary: "Most cloud breaches are identity breaches.", items: ["cloud-security/cloud-iam"] },
      { title: "Cloud network security", summary: "Isolate and inspect cloud traffic.", items: ["cloud-security/cloud-network-security"] },
      { title: "Data protection", summary: "Encryption, KMS, secrets and S3 security.", items: ["cloud-security/data-protection"] },
      { title: "Detection and response", summary: "CloudTrail, GuardDuty, detections and IR.", items: ["cloud-security/detection-response"] },
      { title: "Posture management", summary: "CSPM, CNAPP and compliance as code.", items: ["cloud-security/posture-management"] },
      {
        title: "DevSecOps for the cloud",
        summary: "Secure the pipelines that build your cloud.",
        items: [
          "devsecops/devsecops-foundations",
          "devsecops/supply-chain/securing-cicd-pipelines",
          "devsecops/container-security",
          "devsecops/kubernetes-security",
          "devsecops/iac-security",
          "devsecops/vuln-management",
        ],
      },
      { title: "Attacking the cloud", summary: "Think like an attacker to defend better.", items: ["cloud-security/cloud-pentesting"] },
      { title: "Azure and GCP security", summary: "Entra ID, Defender, Sentinel, SCC.", items: ["cloud-security/multi-cloud-security"] },
      {
        title: "Get hired",
        summary: "Certifications, portfolio and interviews.",
        items: [
          "career/certifications/certification-roadmap",
          "career/certifications/comptia-security",
          "career/certifications/aws-solutions-architect-associate",
          "career/certifications/aws-security-specialty",
          "career/certifications/certified-kubernetes-security-specialist-cks",
          "career/portfolio",
          "career/interviews/resume-and-linkedin-for-tech-roles",
          "career/interviews/security-interview-questions",
          "career/interviews/devops-and-cloud-interview-questions",
          "career/interviews/behavioural-interviews-star",
        ],
      },
    ],
  },
];
