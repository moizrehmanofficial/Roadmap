/**
 * Topics: how the library is browsed ("All topics").
 *
 * Lessons live in content/curriculum.ts (tracks → modules → lessons) and keep their URLs.
 * This file only regroups those modules by technology/subject, in the order a beginner
 * should learn them. Career roadmaps live separately in content/paths.ts.
 *
 * Every lesson in the curriculum must appear in exactly one topic section; the build
 * fails otherwise (see lib/topics.ts), so nothing gets lost when the curriculum grows.
 *
 * A section is a whole module ("track/module"), optionally filtered with `only` / `except`
 * (lesson slugs). `id` is the anchor on the topic page (defaults to the module slug).
 */

export interface TopicSectionDef {
  module: string;
  title?: string;
  summary?: string;
  id?: string;
  only?: string[];
  except?: string[];
}

export interface TopicDef {
  slug: string;
  title: string;
  summary: string;
  mark: string;
  sections: TopicSectionDef[];
}

export interface TopicGroupDef {
  title: string;
  summary: string;
  topics: TopicDef[];
}

export const topicGroups: TopicGroupDef[] = [
  {
    title: "Start here",
    summary: "How computers, operating systems, networks and everyday developer tools work.",
    topics: [
      {
        slug: "computer-basics",
        title: "Computer Basics",
        summary: "Bits and bytes, CPU and memory, how programs run, files, encodings and the operating system.",
        mark: "#8a6d3b",
        sections: [{ module: "foundations/how-computers-work" }],
      },
      {
        slug: "linux",
        title: "Linux",
        summary: "The operating system behind servers, containers and the cloud — from the terminal to hardening a server.",
        mark: "#8a6d3b",
        sections: [{ module: "foundations/linux" }],
      },
      {
        slug: "bash",
        title: "Bash & Shell Scripting",
        summary: "Automate anything you can type in a terminal, from one-liners to production scripts.",
        mark: "#8a6d3b",
        sections: [{ module: "foundations/shell-scripting" }],
      },
      {
        slug: "networking",
        title: "Networking",
        summary: "IP addresses, ports, DNS, HTTP, TLS, proxies, firewalls and the tools to troubleshoot them.",
        mark: "#8a6d3b",
        sections: [{ module: "foundations/networking" }],
      },
      {
        slug: "git",
        title: "Git & GitHub",
        summary: "Version control, branching, pull requests, releases, signing, secrets and GitHub Actions.",
        mark: "#8a6d3b",
        sections: [{ module: "foundations/git" }],
      },
      {
        slug: "data-formats",
        title: "Data Formats & Regex",
        summary: "JSON, YAML, TOML, XML, CSV, regular expressions and encodings.",
        mark: "#8a6d3b",
        sections: [{ module: "foundations/data-formats" }],
      },
      {
        slug: "cryptography",
        title: "Cryptography",
        summary: "Hashing, encryption, keys, signatures, certificates and storing passwords safely.",
        mark: "#8a6d3b",
        sections: [{ module: "foundations/crypto-basics" }],
      },
    ],
  },
  {
    title: "Frontend",
    summary: "What runs in the browser: structure, style and interactivity.",
    topics: [
      {
        slug: "html",
        title: "HTML",
        summary: "The structure of every web page: elements, forms, semantics and accessibility.",
        mark: "#2f5d8a",
        sections: [{ module: "full-stack/html" }],
      },
      {
        slug: "css",
        title: "CSS",
        summary: "Selectors, the box model, Flexbox, Grid, responsive design and animation.",
        mark: "#2f5d8a",
        sections: [{ module: "full-stack/css", except: ["tailwind-css"] }],
      },
      {
        slug: "tailwind-css",
        title: "Tailwind CSS",
        summary: "Utility-first styling for fast, consistent interfaces.",
        mark: "#2f5d8a",
        sections: [{ module: "full-stack/css", only: ["tailwind-css"], id: "tailwind", title: "Tailwind CSS", summary: "Utility-first CSS." }],
      },
      {
        slug: "javascript",
        title: "JavaScript",
        summary:
          "The language of the web and everything built on it: the browser, TypeScript, React, Next.js, Node.js, Express and NestJS.",
        mark: "#2f5d8a",
        sections: [
          { module: "full-stack/javascript", title: "JavaScript Language" },
          { module: "full-stack/browser" },
          { module: "full-stack/typescript" },
          { module: "full-stack/react" },
          { module: "full-stack/nextjs" },
          { module: "full-stack/nodejs" },
          { module: "full-stack/express" },
          { module: "full-stack/nestjs" },
        ],
      },
    ],
  },
  {
    title: "Python",
    summary: "One language for scripts, automation, security tools and web backends.",
    topics: [
      {
        slug: "python",
        title: "Python",
        summary: "From the basics to OOP, packaging, automation, security tooling, Django and FastAPI.",
        mark: "#4c7a3d",
        sections: [
          { module: "python/python-basics" },
          { module: "python/python-data-structures" },
          { module: "python/python-functions" },
          { module: "python/python-oop" },
          { module: "python/python-files-errors" },
          { module: "python/python-environment" },
          { module: "python/python-advanced" },
          { module: "python/python-automation" },
          { module: "python/python-security" },
          { module: "python/python-django" },
          { module: "python/python-web" },
        ],
      },
    ],
  },
  {
    title: "Backend & web engineering",
    summary: "APIs, data, users and everything that makes an application production-ready.",
    topics: [
      {
        slug: "apis",
        title: "APIs",
        summary: "REST design, status codes, pagination, versioning, GraphQL, WebSockets, webhooks, rate limiting and OpenAPI docs.",
        mark: "#2f5d8a",
        sections: [{ module: "full-stack/apis" }],
      },
      {
        slug: "databases",
        title: "Databases",
        summary: "Relational and non-relational databases, data modelling and querying.",
        mark: "#2f5d8a",
        sections: [{ module: "full-stack/databases" }],
      },
      {
        slug: "authentication",
        title: "Authentication & Authorization",
        summary: "Sessions and cookies, JWTs, OAuth 2.0 and OpenID Connect, MFA and role-based access.",
        mark: "#2f5d8a",
        sections: [{ module: "full-stack/auth" }],
      },
      {
        slug: "testing",
        title: "Testing",
        summary: "Unit, integration and end-to-end tests, mocking and test-driven development.",
        mark: "#2f5d8a",
        sections: [{ module: "full-stack/testing" }],
      },
      {
        slug: "web-security",
        title: "Web Security for Developers",
        summary: "The OWASP Top 10 from a developer's side, and how to write code that resists them.",
        mark: "#2f5d8a",
        sections: [{ module: "full-stack/web-security-for-devs" }],
      },
      {
        slug: "performance",
        title: "Performance & Architecture",
        summary: "Core Web Vitals, caching, microservices, message queues and system design.",
        mark: "#2f5d8a",
        sections: [{ module: "full-stack/performance" }],
      },
      {
        slug: "deployment",
        title: "Deployment",
        summary: "Getting web applications into production.",
        mark: "#2f5d8a",
        sections: [{ module: "full-stack/deployment" }],
      },
    ],
  },
  {
    title: "DevOps",
    summary: "Build, ship and run software reliably and automatically.",
    topics: [
      {
        slug: "devops-culture",
        title: "DevOps Culture",
        summary: "What DevOps is, how teams work, and the metrics that matter.",
        mark: "#6b4f8a",
        sections: [{ module: "devops/devops-culture" }],
      },
      {
        slug: "ci-cd",
        title: "CI/CD",
        summary: "Pipelines that build, test and deploy every change.",
        mark: "#6b4f8a",
        sections: [{ module: "devops/ci-cd" }],
      },
      {
        slug: "docker",
        title: "Docker & Containers",
        summary: "Images, containers, Dockerfiles, Compose and registries.",
        mark: "#6b4f8a",
        sections: [{ module: "devops/docker" }],
      },
      {
        slug: "kubernetes",
        title: "Kubernetes",
        summary: "Running containers at scale: pods, deployments, services, ingress, Helm and more.",
        mark: "#6b4f8a",
        sections: [{ module: "devops/kubernetes" }],
      },
      {
        slug: "infrastructure-as-code",
        title: "Infrastructure as Code",
        summary: "Terraform, Ansible and managing infrastructure in Git.",
        mark: "#6b4f8a",
        sections: [{ module: "devops/iac" }],
      },
      {
        slug: "gitops",
        title: "GitOps",
        summary: "Git as the source of truth for deployments with Argo CD and Flux.",
        mark: "#6b4f8a",
        sections: [{ module: "devops/gitops" }],
      },
      {
        slug: "observability",
        title: "Observability & SRE",
        summary: "Metrics, logs, traces, alerts, SLOs and keeping systems reliable.",
        mark: "#6b4f8a",
        sections: [{ module: "devops/observability" }, { module: "devops/sre" }],
      },
    ],
  },
  {
    title: "Cloud",
    summary: "Designing and running systems on AWS, Azure and Google Cloud.",
    topics: [
      {
        slug: "cloud-concepts",
        title: "Cloud Concepts",
        summary: "What the cloud is, service models, regions, pricing and shared responsibility.",
        mark: "#3d7a7a",
        sections: [{ module: "cloud/cloud-concepts" }],
      },
      {
        slug: "aws",
        title: "AWS",
        summary: "Core and advanced Amazon Web Services, from EC2 and S3 to serverless and networking.",
        mark: "#3d7a7a",
        sections: [{ module: "cloud/aws-core" }, { module: "cloud/aws-advanced" }],
      },
      {
        slug: "azure-gcp",
        title: "Azure & Google Cloud",
        summary: "The same ideas on Microsoft Azure and Google Cloud Platform.",
        mark: "#3d7a7a",
        sections: [{ module: "cloud/azure-gcp" }],
      },
      {
        slug: "cloud-architecture",
        title: "Cloud Architecture",
        summary: "Designing reliable, secure and cost-effective cloud systems.",
        mark: "#3d7a7a",
        sections: [{ module: "cloud/cloud-architecture" }],
      },
    ],
  },
  {
    title: "Security",
    summary: "Attack, defend, and build security into code, pipelines and the cloud.",
    topics: [
      {
        slug: "cyber-security",
        title: "Cyber Security",
        summary: "Fundamentals, network and web security, offensive and defensive work, incident response, GRC and threat modelling.",
        mark: "#8a3b3b",
        sections: [
          { module: "cyber-security/security-fundamentals" },
          { module: "cyber-security/network-security" },
          { module: "cyber-security/identity" },
          { module: "cyber-security/web-app-security" },
          { module: "cyber-security/offensive" },
          { module: "cyber-security/defensive" },
          { module: "cyber-security/incident-response" },
          { module: "cyber-security/grc" },
          { module: "cyber-security/threat-modeling" },
        ],
      },
      {
        slug: "devsecops",
        title: "DevSecOps",
        summary: "Security in code, dependencies, containers, Kubernetes and infrastructure, automated in CI/CD.",
        mark: "#8a3b3b",
        sections: [
          { module: "devsecops/devsecops-foundations" },
          { module: "devsecops/code-security" },
          { module: "devsecops/dynamic-testing" },
          { module: "devsecops/supply-chain" },
          { module: "devsecops/container-security" },
          { module: "devsecops/kubernetes-security" },
          { module: "devsecops/iac-security" },
          { module: "devsecops/vuln-management" },
          { module: "devsecops/devsecops-project" },
        ],
      },
      {
        slug: "cloud-security",
        title: "Cloud Security",
        summary: "IAM, network security, data protection, detection, posture management and attacking the cloud.",
        mark: "#8a3b3b",
        sections: [
          { module: "cloud-security/cloud-security-foundations" },
          { module: "cloud-security/cloud-iam" },
          { module: "cloud-security/cloud-network-security" },
          { module: "cloud-security/data-protection" },
          { module: "cloud-security/detection-response" },
          { module: "cloud-security/posture-management" },
          { module: "cloud-security/cloud-pentesting" },
          { module: "cloud-security/multi-cloud-security" },
        ],
      },
    ],
  },
  {
    title: "Career",
    summary: "Turning skills into a job.",
    topics: [
      {
        slug: "career",
        title: "Career",
        summary: "Certifications, portfolio projects and interview preparation.",
        mark: "#5a5a5a",
        sections: [{ module: "career/certifications" }, { module: "career/portfolio" }, { module: "career/interviews" }],
      },
    ],
  },
];
