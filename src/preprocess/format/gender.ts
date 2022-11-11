import { Gender } from "../../types/Types";

export function getGender(genderString: string): Gender {
  switch (genderString) {
    case "kk":
      return Gender.Male;
    case "kvk":
      return Gender.Female;
    case "hk":
      return Gender.Neuter;
    default:
      throw new Error(`Unexpected gender '${genderString}'`);
  }
}
