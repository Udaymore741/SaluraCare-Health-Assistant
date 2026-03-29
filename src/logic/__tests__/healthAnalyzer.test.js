import { describe, it, expect } from 'vitest';
import { analyzeRisk, containsHighRiskSymptoms, getRecommendation } from '../healthAnalyzer.js';

describe('Health Analyzer', () => {
  describe('containsHighRiskSymptoms', () => {
    it('should detect "chest pain" case-insensitively', () => {
      expect(containsHighRiskSymptoms('chest pain')).toBe(true);
      expect(containsHighRiskSymptoms('CHEST PAIN')).toBe(true);
      expect(containsHighRiskSymptoms('Chest Pain')).toBe(true);
      expect(containsHighRiskSymptoms('I have chest pain and discomfort')).toBe(true);
    });

    it('should detect "breathing issue" case-insensitively', () => {
      expect(containsHighRiskSymptoms('breathing issue')).toBe(true);
      expect(containsHighRiskSymptoms('BREATHING ISSUE')).toBe(true);
      expect(containsHighRiskSymptoms('Breathing Issue')).toBe(true);
      expect(containsHighRiskSymptoms('I have a breathing issue')).toBe(true);
    });

    it('should return false for non-high-risk symptoms', () => {
      expect(containsHighRiskSymptoms('headache')).toBe(false);
      expect(containsHighRiskSymptoms('fever')).toBe(false);
      expect(containsHighRiskSymptoms('')).toBe(false);
    });

    it('should handle null or undefined input', () => {
      expect(containsHighRiskSymptoms(null)).toBe(false);
      expect(containsHighRiskSymptoms(undefined)).toBe(false);
    });
  });

  describe('analyzeRisk', () => {
    it('should classify chest pain as HIGH risk', () => {
      const symptomData = {
        age: 45,
        symptoms: 'chest pain and discomfort',
        duration: 1
      };
      expect(analyzeRisk(symptomData)).toBe('HIGH');
    });

    it('should classify breathing issue as HIGH risk', () => {
      const symptomData = {
        age: 30,
        symptoms: 'breathing issue',
        duration: 2
      };
      expect(analyzeRisk(symptomData)).toBe('HIGH');
    });

    it('should classify fever > 3 days as MEDIUM risk', () => {
      const symptomData = {
        age: 25,
        symptoms: 'fever and headache',
        duration: 4
      };
      expect(analyzeRisk(symptomData)).toBe('MEDIUM');
    });

    it('should classify fever <= 3 days as LOW risk', () => {
      const symptomData = {
        age: 25,
        symptoms: 'fever',
        duration: 3
      };
      expect(analyzeRisk(symptomData)).toBe('LOW');
    });

    it('should prioritize HIGH risk over MEDIUM risk', () => {
      const symptomData = {
        age: 40,
        symptoms: 'chest pain and fever',
        duration: 5
      };
      expect(analyzeRisk(symptomData)).toBe('HIGH');
    });

    it('should classify non-matching symptoms as LOW risk', () => {
      const symptomData = {
        age: 20,
        symptoms: 'headache',
        duration: 1
      };
      expect(analyzeRisk(symptomData)).toBe('LOW');
    });

    it('should handle null symptomData', () => {
      expect(analyzeRisk(null)).toBe('LOW');
    });

    it('should handle empty symptoms', () => {
      const symptomData = {
        age: 30,
        symptoms: '',
        duration: 2
      };
      expect(analyzeRisk(symptomData)).toBe('LOW');
    });
  });

  describe('getRecommendation', () => {
    it('should return correct recommendation for HIGH risk', () => {
      expect(getRecommendation('HIGH')).toBe('Doctor Consultation / Emergency Care');
    });

    it('should return correct recommendation for MEDIUM risk', () => {
      expect(getRecommendation('MEDIUM')).toBe('Lab Test Booking');
    });

    it('should return correct recommendation for LOW risk', () => {
      expect(getRecommendation('LOW')).toBe('Pharmacy / Home Care Advice');
    });

    it('should default to LOW recommendation for unknown risk level', () => {
      expect(getRecommendation('UNKNOWN')).toBe('Pharmacy / Home Care Advice');
      expect(getRecommendation('')).toBe('Pharmacy / Home Care Advice');
    });
  });
});
