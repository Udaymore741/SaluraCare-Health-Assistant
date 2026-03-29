import { describe, it, expect } from 'vitest';
import {
  CONVERSATION_STEPS,
  getNextPrompt,
  validateInput,
  processUserInput
} from '../conversationController.js';

describe('Conversation Controller', () => {
  describe('CONVERSATION_STEPS constants', () => {
    it('should define all conversation step constants', () => {
      expect(CONVERSATION_STEPS.DISCLAIMER).toBe('DISCLAIMER');
      expect(CONVERSATION_STEPS.ASK_AGE).toBe('ASK_AGE');
      expect(CONVERSATION_STEPS.ASK_SYMPTOMS).toBe('ASK_SYMPTOMS');
      expect(CONVERSATION_STEPS.ASK_DURATION).toBe('ASK_DURATION');
      expect(CONVERSATION_STEPS.ANALYZE).toBe('ANALYZE');
      expect(CONVERSATION_STEPS.COMPLETE).toBe('COMPLETE');
    });
  });

  describe('getNextPrompt', () => {
    it('should return disclaimer message for DISCLAIMER step', () => {
      const prompt = getNextPrompt(CONVERSATION_STEPS.DISCLAIMER, {});
      expect(prompt).toContain('SaluraCare Health Assistant');
      expect(prompt).toContain('not a medical professional');
    });

    it('should return age request for ASK_AGE step', () => {
      const prompt = getNextPrompt(CONVERSATION_STEPS.ASK_AGE, {});
      expect(prompt).toContain('age');
    });

    it('should return symptoms request for ASK_SYMPTOMS step', () => {
      const prompt = getNextPrompt(CONVERSATION_STEPS.ASK_SYMPTOMS, {});
      expect(prompt).toContain('symptoms');
    });

    it('should return duration request for ASK_DURATION step', () => {
      const prompt = getNextPrompt(CONVERSATION_STEPS.ASK_DURATION, {});
      expect(prompt).toContain('days');
    });

    it('should return analyzing message for ANALYZE step', () => {
      const prompt = getNextPrompt(CONVERSATION_STEPS.ANALYZE, {});
      expect(prompt).toContain('Analyzing');
    });

    it('should return completion message for COMPLETE step', () => {
      const prompt = getNextPrompt(CONVERSATION_STEPS.COMPLETE, {});
      expect(prompt).toContain('Thank you');
    });
  });

  describe('validateInput - age validation', () => {
    it('should accept valid positive integer age', () => {
      const result = validateInput('25', 'age');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBe(25);
    });

    it('should reject non-numeric age input', () => {
      const result = validateInput('abc', 'age');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid age as a number');
    });

    it('should reject zero age', () => {
      const result = validateInput('0', 'age');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid age greater than 0');
    });

    it('should reject negative age', () => {
      const result = validateInput('-5', 'age');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid age greater than 0');
    });

    it('should reject decimal age', () => {
      const result = validateInput('25.5', 'age');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid age greater than 0');
    });

    it('should reject empty age input', () => {
      const result = validateInput('', 'age');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid age as a number');
    });
  });

  describe('validateInput - duration validation', () => {
    it('should accept valid positive integer duration', () => {
      const result = validateInput('5', 'duration');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBe(5);
    });

    it('should accept zero duration', () => {
      const result = validateInput('0', 'duration');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBe(0);
    });

    it('should reject non-numeric duration input', () => {
      const result = validateInput('abc', 'duration');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter the number of days');
    });

    it('should reject negative duration', () => {
      const result = validateInput('-3', 'duration');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Duration must be 0 or more days');
    });

    it('should reject decimal duration', () => {
      const result = validateInput('3.5', 'duration');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Duration must be 0 or more days');
    });

    it('should reject empty duration input', () => {
      const result = validateInput('', 'duration');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter the number of days');
    });
  });

  describe('validateInput - symptoms validation', () => {
    it('should accept non-empty symptom description', () => {
      const result = validateInput('headache and fever', 'symptoms');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBe('headache and fever');
    });

    it('should accept single character symptom', () => {
      const result = validateInput('a', 'symptoms');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBe('a');
    });

    it('should accept symptoms with special characters', () => {
      const result = validateInput('pain! @#$%', 'symptoms');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBe('pain! @#$%');
    });

    it('should reject empty symptom description', () => {
      const result = validateInput('', 'symptoms');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please describe your symptoms');
    });

    it('should reject whitespace-only symptom description', () => {
      const result = validateInput('   ', 'symptoms');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please describe your symptoms');
    });
  });

  describe('processUserInput', () => {
    it('should process valid age input', () => {
      const result = processUserInput('30', CONVERSATION_STEPS.ASK_AGE);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(30);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should process invalid age input', () => {
      const result = processUserInput('abc', CONVERSATION_STEPS.ASK_AGE);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid age as a number');
    });

    it('should process valid symptoms input', () => {
      const result = processUserInput('chest pain', CONVERSATION_STEPS.ASK_SYMPTOMS);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe('chest pain');
      expect(result.errorMessage).toBeUndefined();
    });

    it('should process invalid symptoms input', () => {
      const result = processUserInput('', CONVERSATION_STEPS.ASK_SYMPTOMS);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please describe your symptoms');
    });

    it('should process valid duration input', () => {
      const result = processUserInput('7', CONVERSATION_STEPS.ASK_DURATION);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(7);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should process invalid duration input', () => {
      const result = processUserInput('-1', CONVERSATION_STEPS.ASK_DURATION);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Duration must be 0 or more days');
    });

    it('should accept any input for non-validation steps', () => {
      const result = processUserInput('anything', CONVERSATION_STEPS.DISCLAIMER);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe('anything');
    });
  });

  describe('Edge cases', () => {
    it('should trim whitespace from age input', () => {
      const result = validateInput('  25  ', 'age');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBe(25);
    });

    it('should trim whitespace from duration input', () => {
      const result = validateInput('  5  ', 'duration');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBe(5);
    });

    it('should trim whitespace from symptoms input', () => {
      const result = validateInput('  headache  ', 'symptoms');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBe('headache');
    });

    it('should handle very large age values', () => {
      const result = validateInput('150', 'age');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBe(150);
    });

    it('should handle very large duration values', () => {
      const result = validateInput('365', 'duration');
      expect(result.isValid).toBe(true);
      expect(result.parsedValue).toBe(365);
    });
  });
});
