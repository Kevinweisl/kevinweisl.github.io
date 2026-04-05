export interface ExperienceDetail {
    title: string;
    institution: string;
    period: string;
    description?: string | string[];
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
          period: "2019 - Present (Expected 2026)",
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
          description: "Programming and Web Scraping (GenEdu5010)\n2021 Spring, 2021 Fall, 2022 Spring, 2022 Fall, 2023 Spring, 2023 Fall, 2024 Spring, 2025 Spring, 2025 Fall, 2026 Spring"
        },
        {
          title: "Adjunct Instructor",
          institution: "Department of Economics, National Taiwan University",
          period: "2022 - Present",
          description: "Programming (ECON1024)\n2022 Spring, 2023 Spring, 2024 Spring, 2025 Spring, 2026 Spring"
        }
      ]
    },
    {
      categoryTitle: "Work",
      items: [
        {
          title: "Machine Learning Engineer",
          institution: "ShopBack | Taipei, Taiwan",
          period: "2022/05 - 2023/06",
          description: []
        },
        {
          title: "Data Engineer",
          institution: "Junyi Academy | Taipei, Taiwan",
          period: "2020/02 - 2021/02",
          description: []
        },
        {
          title: "Software Engineer, Applied Data Science Team",
          institution: "KKStream Limited, KKBOX Group | Taipei, Taiwan",
          period: "2016/12 - 2020/01",
          description: []
        },
        {
          title: "Software Engineer, College Intern",
          institution: "Hewlett Packard Enterprise | Taipei, Taiwan",
          period: "2015/08 - 2016/06",
          description: []
        }
      ]
    },
  ];


