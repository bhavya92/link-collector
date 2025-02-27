export const generate_otp = (): number => {
  const MAX = 999999,
    MIN = 100000;
  return Math.floor(Math.random() * (MAX - MIN) + MIN);
};
