/**
 * Health Analyzer Module
 * 
 * Provides rule-based health risk assessment functionality.
 * Analyzes symptom data and classifies risk levels as HIGH, MEDIUM, or LOW.
 */

/**
 * Checks if symptoms contain high-risk keywords (case-insensitive)
 * @param {string} symptoms - Symptom description text
 * @returns {boolean} - True if high-risk symptoms detected
 */
export function containsHighRiskSymptoms(symptoms) {
  if (!symptoms || typeof symptoms !== 'string') {
    return false;
  }
  
  const symptomsLower = symptoms.toLowerCase();
  const highRiskKeywords = ['chest pain', 'breathing issue'];
  
  return highRiskKeywords.some(keyword => symptomsLower.includes(keyword));
}

/**
 * Analyzes symptom data and returns risk level
 * @param {Object} symptomData - User's health information
 * @param {number} symptomData.age - User's age in years
 * @param {string} symptomData.symptoms - Symptom description
 * @param {number} symptomData.duration - Symptom duration in days
 * @returns {string} - Classification: 'LOW', 'MEDIUM', or 'HIGH'
 */
export function analyzeRisk(symptomData) {
  if (!symptomData) {
    return 'LOW';
  }
  
  const { symptoms, duration } = symptomData;
  
  // Priority 1: Check for HIGH risk keywords (case-insensitive)
  if (containsHighRiskSymptoms(symptoms)) {
    return 'HIGH';
  }
  
  // Priority 2: Check for MEDIUM risk conditions (fever duration > 3 days)
  if (symptoms && typeof symptoms === 'string' && 
      symptoms.toLowerCase().includes('fever') && 
      duration > 3) {
    return 'MEDIUM';
  }
  
  // Default: LOW risk
  return 'LOW';
}

/**
 * Maps risk level to healthcare recommendation
 * @param {string} riskLevel - The assessed risk level ('LOW', 'MEDIUM', or 'HIGH')
 * @returns {string} - Recommendation text
 */
export function getRecommendation(riskLevel) {
  const recommendations = {
    'HIGH': 'Doctor Consultation / Emergency Care',
    'MEDIUM': 'Lab Test Booking',
    'LOW': 'Pharmacy / Home Care Advice'
  };
  
  return recommendations[riskLevel] || recommendations['LOW'];
}
