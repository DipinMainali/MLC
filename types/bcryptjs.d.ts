declare module "bcryptjs" {
  const bcrypt: {
    compare(plainText: string, hash: string): Promise<boolean>;
  };

  export default bcrypt;
}
