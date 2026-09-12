export interface ExperienceDetail {
    title: string;
    institution: string;
    /** The institution's site. Set on companies; NTU and Academia Sinica need no link. */
    url?: string;
    /** "Taipei, Taiwan". Rendered after the institution, separated from it. */
    location?: string;
    period: string;
    description?: string;
    /** Semesters taught, one per entry. The count shown on the page is derived
     *  from this array's length, so adding a semester is a one-place edit. */
    semesters?: string[];
  }

  export interface ExperienceCategory {
    categoryTitle: string;
    items: ExperienceDetail[];
  }

  export const experienceData: ExperienceCategory[] = [
    {
      categoryTitle: "Education",
      items: [
        {
          title: "PhD, Computer Science",
          institution: "National Taiwan University",
          period: "2026",
          description: "Main Research Area: Large Language Model"
        },
        {
          title: "MS, Computer Science",
          institution: "National Taiwan University",
          period: "2016",
          description: "Main Research Area: Information Extraction"
        },
        {
          title: "BS, Computer Science",
          institution: "National Taiwan University",
          period: "2014"
        }
      ]
    },
    {
      categoryTitle: "Teaching",
      items: [
        {
          title: "Adjunct Instructor",
          institution: "Center of General Education, National Taiwan University",
          period: "2021 - Present",
          description: "Programming and Web Scraping (GenEdu5010)",
          semesters: [
            "2021 Spring",
            "2021 Fall",
            "2022 Spring",
            "2022 Fall",
            "2023 Spring",
            "2023 Fall",
            "2024 Spring",
            "2025 Spring",
            "2025 Fall",
            "2026 Spring"
          ]
        },
        {
          title: "Adjunct Instructor",
          institution: "Department of Economics, National Taiwan University",
          period: "2022 - Present",
          description: "Programming (ECON1024)",
          semesters: [
            "2022 Spring",
            "2023 Spring",
            "2024 Spring",
            "2025 Spring",
            "2026 Spring"
          ]
        }
      ]
    },
    {
      categoryTitle: "Work",
      items: [
        {
          title: "Postdoctoral Researcher",
          institution: "Academia Sinica",
          location: "Taipei, Taiwan",
          period: "2026/09 - Present",
        },
        {
          title: "Co-founder & CTO",
          institution: "OrbitNext",
          url: "https://orbit-next.com/",
          period: "2022/07 - 2025/07",
        },
        {
          title: "Senior Machine Learning Engineer",
          institution: "ShopBack",
          url: "https://www.shopback.sg/",
          location: "Taipei, Taiwan",
          period: "2022/05 - 2023/06",

        },
        {
          title: "Senior Data Engineer",
          institution: "Junyi Academy",
          url: "https://www.junyiacademy.org/",
          location: "Taipei, Taiwan",
          period: "2020/02 - 2021/02",

        },
        {
          title: "(Senior) Software Engineer, Applied Data Science Team",
          institution: "KKStream Limited, KKBOX Group",
          url: "https://blendvision.com/",
          location: "Taipei, Taiwan",
          period: "2016/12 - 2020/01",
        },
        {
          title: "Software Engineer, College Intern",
          institution: "Hewlett Packard Enterprise",
          location: "Taipei, Taiwan",
          period: "2015/08 - 2016/06",

        }
      ]
    },
  ];


