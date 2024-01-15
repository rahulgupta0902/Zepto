

export type User =  {
    id: number;
    name: string;
    email: string;
    profilePicture : string
  }

 export type Chip = {
    id: number;
    user: User;
 }