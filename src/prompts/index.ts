import { loginPrompts } from './loginPrompts.js';
import {
  getPromptOfDate,
  getPromptOfIsReserved,
  getPromptOfPatient,
  getPromptOfPrice,
  getPromptOfTherapy,
  getPromptOfUser,
} from './promptsObj.js';
import {
  datePrompts,
  isReservedPrompts,
  patientPrompts,
  pricePrompts,
  saveParamsPrompts,
  userPrompts,
} from './saveParamsPrompts.js';
import { therapyPrompts } from './therapyPrompts.js';
import {
  isContinueInput,
  isInitInteractiveUI,
  isNewPatient,
  yesOrNoPrompts,
} from './yesOrNoPrompts.js';

export {
  loginPrompts,
  saveParamsPrompts,
  datePrompts,
  pricePrompts,
  userPrompts,
  isReservedPrompts,
  patientPrompts,
  therapyPrompts,
  yesOrNoPrompts,
  getPromptOfDate,
  getPromptOfPrice,
  getPromptOfUser,
  getPromptOfIsReserved,
  getPromptOfPatient,
  getPromptOfTherapy,
  isContinueInput,
  isInitInteractiveUI,
  isNewPatient,
};
