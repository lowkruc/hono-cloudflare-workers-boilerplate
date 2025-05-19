export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export class UserEntity implements User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    props: Omit<User, 'createdAt' | 'updatedAt'> & {
      password?: string;
      createdAt?: string;
      updatedAt?: string;
    },
  ) {
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.password = props.password;
    this.role = props.role || 'user';
    this.createdAt = props.createdAt ?? new Date().toISOString();
    this.updatedAt = props.updatedAt ?? new Date().toISOString();
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
