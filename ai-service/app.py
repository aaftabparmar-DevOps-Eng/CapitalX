from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ============================================================
# AI RISK SCORING ENGINE
# ============================================================

class AIRiskEngine:
    def __init__(self):
        self.scaler = StandardScaler()
        self.risk_classifier = None
        self.return_predictor = None
        self.fraud_detector = None
        self.load_or_train_models()
    
    def load_or_train_models(self):
        """Load pre-trained models or train on synthetic data"""
        try:
            self.risk_classifier = joblib.load('models/risk_classifier.pkl')
            self.return_predictor = joblib.load('models/return_predictor.pkl')
            self.fraud_detector = joblib.load('models/fraud_detector.pkl')
            self.scaler = joblib.load('models/scaler.pkl')
            print("✅ Models loaded successfully")
        except:
            print("⚠️ Training new models on synthetic data...")
            self.train_models()
    
    def train_models(self):
        """Train models on synthetic data (replace with real data in production)"""
        np.random.seed(42)
        n_samples = 5000
        
        # Generate synthetic training data
        data = {
            'monthly_revenue': np.random.lognormal(12, 1.5, n_samples),
            'profit_margin': np.random.uniform(-10, 60, n_samples),
            'business_age_months': np.random.randint(1, 120, n_samples),
            'team_size': np.random.randint(1, 500, n_samples),
            'funding_goal': np.random.lognormal(12, 1.5, n_samples),
            'previous_rounds': np.random.randint(0, 5, n_samples),
            'industry_growth': np.random.uniform(-5, 30, n_samples),
            'has_website': np.random.randint(0, 2, n_samples),
            'documents_verified': np.random.randint(0, 5, n_samples),
            'owner_credit_score': np.random.randint(300, 900, n_samples),
            'social_media_presence': np.random.randint(0, 100, n_samples),
            'customer_reviews_avg': np.random.uniform(1, 5, n_samples),
        }
        
        df = pd.DataFrame(data)
        
        # Target: Risk Score (0-100)
        df['risk_score'] = (
            (df['monthly_revenue'] / df['monthly_revenue'].max()) * 25 +
            (df['profit_margin'].clip(0) / 60) * 20 +
            (df['business_age_months'] / 120) * 15 +
            (df['documents_verified'] / 5) * 15 +
            (df['owner_credit_score'] / 900) * 10 +
            (df['has_website']) * 5 +
            (df['customer_reviews_avg'] / 5) * 10
        ).clip(0, 100)
        
        # Target: Risk Level
        df['risk_level'] = pd.cut(df['risk_score'], bins=[0, 40, 65, 85, 100], labels=[3, 2, 1, 0])
        
        # Target: Fraud probability
        df['fraud_probability'] = (
            (1 - df['documents_verified'] / 5) * 0.4 +
            (1 - df['has_website']) * 0.2 +
            (1 - df['owner_credit_score'] / 900) * 0.3 +
            (1 - df['customer_reviews_avg'] / 5) * 0.1
        ).clip(0, 1)
        
        df['is_fraud'] = (df['fraud_probability'] > 0.4).astype(int)
        
        # Features
        feature_cols = [col for col in df.columns if col not in ['risk_score', 'risk_level', 'fraud_probability', 'is_fraud']]
        X = df[feature_cols].values
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train Risk Classifier
        self.risk_classifier = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
        self.risk_classifier.fit(X_scaled, df['risk_level'])
        
        # Train Return Predictor
        self.return_predictor = GradientBoostingRegressor(n_estimators=100, max_depth=5, random_state=42)
        self.return_predictor.fit(X_scaled, df['risk_score'])
        
        # Train Fraud Detector
        self.fraud_detector = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42)
        self.fraud_detector.fit(X_scaled, df['is_fraud'])
        
        # Save models
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.risk_classifier, 'models/risk_classifier.pkl')
        joblib.dump(self.return_predictor, 'models/return_predictor.pkl')
        joblib.dump(self.fraud_detector, 'models/fraud_detector.pkl')
        joblib.dump(self.scaler, 'models/scaler.pkl')
        print("✅ Models trained & saved")
    
    def extract_features(self, business_data):
        """Extract features from business data"""
        return np.array([[
            business_data.get('monthlyRevenue', 0) or 0,
            business_data.get('profitMargin', 0) or 0,
            business_data.get('businessAgeMonths', 12),
            business_data.get('teamSize', 0) or 0,
            business_data.get('fundingGoal', 0) or 0,
            business_data.get('previousRounds', 0),
            business_data.get('industryGrowth', 5),
            1 if business_data.get('website') else 0,
            len(business_data.get('documents', [])) if business_data.get('documents') else 0,
            business_data.get('ownerCreditScore', 650),
            business_data.get('socialMediaPresence', 50),
            business_data.get('customerReviewsAvg', 3.5),
        ]])
    
    def predict(self, business_data):
        """Make comprehensive AI prediction"""
        features = self.extract_features(business_data)
        features_scaled = self.scaler.transform(features)
        
        # Risk Level Prediction
        risk_level_num = int(self.risk_classifier.predict(features_scaled)[0])
        risk_levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        risk_level = risk_levels[risk_level_num]
        
        # Risk Score Prediction
        risk_score = float(self.return_predictor.predict(features_scaled)[0])
        risk_score = max(0, min(100, risk_score))
        
        # Fraud Detection
        fraud_prob = float(self.fraud_detector.predict_proba(features_scaled)[0][1])
        is_fraud = fraud_prob > 0.4
        
        # Generate insights
        insights = self.generate_insights(business_data, risk_score, fraud_prob)
        
        return {
            'overallScore': round(risk_score, 1),
            'riskLevel': risk_level,
            'fraudProbability': round(fraud_prob * 100, 1),
            'isFraud': is_fraud,
            'financialScore': round(min(100, risk_score + np.random.uniform(-5, 10)), 1),
            'marketScore': round(min(100, risk_score + np.random.uniform(-8, 12)), 1),
            'teamScore': round(min(100, 60 + (business_data.get('teamSize', 0) or 0) * 0.1), 1),
            'complianceScore': round(min(100, 50 + (len(business_data.get('documents', [])) if business_data.get('documents') else 0) * 10), 1),
            'insights': insights,
            'scoredAt': datetime.now().isoformat(),
        }
    
    def generate_insights(self, data, score, fraud_prob):
        """Generate human-readable insights"""
        insights = []
        
        if score >= 85:
            insights.append({'type': 'POSITIVE', 'message': 'Excellent financial health & strong fundamentals'})
        elif score >= 65:
            insights.append({'type': 'NEUTRAL', 'message': 'Good potential but some areas need improvement'})
        else:
            insights.append({'type': 'NEGATIVE', 'message': 'High risk — requires deeper due diligence'})
        
        if fraud_prob > 0.3:
            insights.append({'type': 'WARNING', 'message': f'{round(fraud_prob*100)}% fraud probability — verify documents carefully'})
        
        if not data.get('website'):
            insights.append({'type': 'SUGGESTION', 'message': 'Adding a website can improve trust score by 5 points'})
        
        if (data.get('monthlyRevenue', 0) or 0) > 1000000:
            insights.append({'type': 'POSITIVE', 'message': 'Strong revenue stream detected'})
        
        return insights


# Initialize AI Engine
ai_engine = AIRiskEngine()

# ============================================================
# API ENDPOINTS
# ============================================================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'CapitalX AI Engine', 'version': '2.0'})

@app.route('/api/ai/score-business', methods=['POST'])
def score_business():
    """Score a single business for risk & trust"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        result = ai_engine.predict(data)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/ai/batch-score', methods=['POST'])
def batch_score():
    """Score multiple businesses at once"""
    try:
        businesses = request.get_json()
        if not businesses or not isinstance(businesses, list):
            return jsonify({'error': 'Expected list of businesses'}), 400
        
        results = []
        for biz in businesses:
            result = ai_engine.predict(biz)
            result['businessId'] = biz.get('id', 'unknown')
            results.append(result)
        
        return jsonify({'success': True, 'data': results, 'count': len(results)})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/ai/portfolio-risk', methods=['POST'])
def portfolio_risk():
    """Analyze portfolio risk for an investor"""
    try:
        data = request.get_json()
        investments = data.get('investments', [])
        
        if not investments:
            return jsonify({'error': 'No investments provided'}), 400
        
        total = len(investments)
        scores = []
        for inv in investments:
            result = ai_engine.predict(inv.get('business', {}))
            scores.append(result['overallScore'])
        
        avg_score = sum(scores) / len(scores) if scores else 0
        low_risk = sum(1 for s in scores if s >= 85)
        med_risk = sum(1 for s in scores if 65 <= s < 85)
        high_risk = sum(1 for s in scores if s < 65)
        
        return jsonify({
            'success': True,
            'data': {
                'totalInvestments': total,
                'averageScore': round(avg_score, 1),
                'riskDistribution': {
                    'low': low_risk,
                    'medium': med_risk,
                    'high': high_risk,
                },
                'diversificationScore': round(min(100, (total / 10) * 100), 1),
                'overallRisk': 'LOW' if avg_score >= 85 else 'MEDIUM' if avg_score >= 65 else 'HIGH',
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/ai/fraud-check', methods=['POST'])
def fraud_check():
    """Deep fraud analysis for a business"""
    try:
        data = request.get_json()
        result = ai_engine.predict(data)
        
        # Enhanced fraud analysis
        fraud_flags = []
        if not data.get('documents') or len(data.get('documents', [])) < 2:
            fraud_flags.append({'type': 'MISSING_DOCS', 'severity': 'HIGH', 'message': 'Less than 2 documents provided'})
        if not data.get('website'):
            fraud_flags.append({'type': 'NO_WEBSITE', 'severity': 'MEDIUM', 'message': 'No business website found'})
        if (data.get('monthlyRevenue', 0) or 0) > 10000000 and (data.get('teamSize', 0) or 0) < 5:
            fraud_flags.append({'type': 'SUSPICIOUS_RATIO', 'severity': 'HIGH', 'message': 'High revenue with very small team'})
        
        result['fraudFlags'] = fraud_flags
        result['passedFraudCheck'] = len([f for f in fraud_flags if f['severity'] == 'HIGH']) == 0
        
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
