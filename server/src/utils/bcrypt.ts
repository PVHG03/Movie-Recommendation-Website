import bcrypt from "bcrypt";

export const hashValue = async (value: string, salt?: number) => {
  return await bcrypt.hash(value, salt || 10);
};

export const compareValues = async (value: string, hashedValue: string) => {
  return await bcrypt.compare(value, hashedValue);
};
