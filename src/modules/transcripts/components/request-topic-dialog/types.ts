export type SuggestedExpert = {
  name: string;
  linkedin: string;
};

export type RequestTopicFormValues = {
  domains: string[];
  topic: string;
  email: string;
  remark: string;
  suggestedExperts: SuggestedExpert[];
};
