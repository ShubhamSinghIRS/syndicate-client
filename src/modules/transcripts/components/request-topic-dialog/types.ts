export type SuggestedExpert = {
  name: string;
  linkedin: string;
};

export type RequestTopicFormValues = {
  domain: string[];
  topic: string;
  email: string;
  remark: string;
  suggestedExperts: SuggestedExpert[];
};
