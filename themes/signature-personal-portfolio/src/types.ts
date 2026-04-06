export interface SectionContent {
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  padding: string;
  borderRadius: string;
  imageUrl?: string;
}

export interface Section {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  content: SectionContent;
}

export type Category = "Hero" | "Footer" | "CTA" | "Services" | "Testimonials" | "Landing";
