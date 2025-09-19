import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Netflix",
  "Meta",
  "Stripe",
  "Airbnb",
  "Shopify",
  "Uber",
  "Tesla",
  "ByteDance",
  "Salesforce",
  "Oracle",
  "IBM",
  "Spotify",
  "OpenAI",
  "SpaceX",
  "Adobe",
  "LinkedIn",
  "Zoom",
  "BoltTech",
  "HealthSync",
  "EduSmart",
  "Cloudify",
  "GreenTech",
];

const categories = [
  "ENGINEERING",
  "DESIGN",
  "MARKETING",
  "SALES",
  "FINANCE",
  "HR",
  "OPERATIONS",
  "SUPPORT",
];

const skillsByCategory = {
  ENGINEERING: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Java",
    "C#",
    "SQL",
    "AWS",
    "Docker",
    "Kubernetes",
  ],
  DESIGN: ["Figma", "Sketch", "Adobe XD", "UI/UX", "Illustrator", "Photoshop"],
  MARKETING: [
    "SEO",
    "Google Analytics",
    "Content Writing",
    "Social Media",
    "Email Marketing",
    "PPC",
  ],
  SALES: [
    "CRM",
    "Lead Generation",
    "Negotiation",
    "Customer Success",
    "Account Management",
  ],
  FINANCE: [
    "Excel",
    "Financial Modeling",
    "Accounting",
    "Forecasting",
    "Risk Analysis",
  ],
  HR: [
    "Recruitment",
    "Onboarding",
    "Payroll",
    "Employee Relations",
    "Performance Reviews",
  ],
  OPERATIONS: [
    "Project Management",
    "Supply Chain",
    "Process Improvement",
    "Logistics",
  ],
  SUPPORT: [
    "Customer Support",
    "Helpdesk",
    "Troubleshooting",
    "Zendesk",
    "Communication",
  ],
};

function salaryRange(seniority, category) {
  let base = 0;
  switch (seniority) {
    case "INTERN":
      base = 15000;
      break;
    case "JUNIOR":
      base = 40000;
      break;
    case "MID":
      base = 70000;
      break;
    case "SENIOR":
      base = 100000;
      break;
    case "LEAD":
      base = 130000;
      break;
  }
  if (category === "ENGINEERING" || category === "FINANCE") base += 10000;
  const salaryMin = base;
  const salaryMax = base + faker.number.int({ min: 5000, max: 30000 });
  return { salaryMin, salaryMax };
}

function generateDescription(title, company, category) {
  return `
### About the Role
We are seeking a **${title}** to join our team at **${company}**.
You will play a key role in the ${category.toLowerCase()} department.

### Responsibilities
- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}

### Requirements
- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}

### Benefits
- Competitive salary and equity
- Health insurance
- Flexible working hours
- Learning & development budget
  `;
}

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Seed companies
  const companyRecords = await Promise.all(
    companies.map((c) =>
      prisma.company.create({
        data: {
          name: c,
          location: `${faker.location.city()}, ${faker.location.country()}`,
        },
      })
    )
  );

  // 2. Seed categories
  const categoryRecords = await Promise.all(
    categories.map((cat) =>
      prisma.category.create({
        data: { name: cat },
      })
    )
  );

  // 3. Seed skills
  const allSkills = [...new Set(Object.values(skillsByCategory).flat())];
  const skillRecords = await Promise.all(
    allSkills.map((s) =>
      prisma.skill.create({
        data: { name: s },
      })
    )
  );

  // Skill lookup
  const skillMap = {};
  skillRecords.forEach((s) => {
    skillMap[s.name] = s.id;
  });

  // 4. Seed jobs
  for (let i = 0; i < 1500; i++) {
    const company = faker.helpers.arrayElement(companyRecords);
    const category = faker.helpers.arrayElement(categoryRecords);
    const seniority = faker.helpers.arrayElement([
      "INTERN",
      "JUNIOR",
      "MID",
      "SENIOR",
      "LEAD",
    ]);
    const type = faker.helpers.arrayElement([
      "FULL_TIME",
      "PART_TIME",
      "REMOTE",
      "INTERNSHIP",
    ]);
    const jobTitle = faker.person.jobTitle();

    const { salaryMin, salaryMax } = salaryRange(seniority, category.name);

    const job = await prisma.job.create({
      data: {
        title: jobTitle,
        description: generateDescription(jobTitle, company.name, category.name),
        type,
        seniority,
        salaryMin,
        salaryMax,
        postedAt: faker.date.recent({ days: 180 }),
        companyId: company.id,
        categoryId: category.id,
      },
    });

    // Add 3–6 skills
    const selectedSkills = faker.helpers.arrayElements(
      skillsByCategory[category.name],
      { min: 3, max: 6 }
    );
    for (const skill of selectedSkills) {
      await prisma.jobSkill.create({
        data: {
          jobId: job.id,
          skillId: skillMap[skill],
        },
      });
    }
  }

  console.log("✅ Database seeded with 1500 jobs");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
