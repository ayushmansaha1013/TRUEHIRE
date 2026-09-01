import requests

url = 'http://localhost:8000/api/scan'

# ── TEST 1: OBVIOUS SCAM
print('TEST 1: Obvious Scam Job')
print('=' * 40)
body1 = {
    'input_type': 'text',
    'content': 'Urgent hiring! Data Entry Executive at TCS Global Services. Salary Rs 85000 per month. No experience needed. Work from home. Pay Rs 1500 registration fee to confirm your seat. WhatsApp on 9876543210 only. Limited seats hurry!'
}
r1 = requests.post(url, json=body1)
d1 = r1.json()
print('Score:', d1.get('fraud_score'))
print('Risk:', d1.get('risk_level'))
print('Red Flags:', len(d1.get('signals_fired', [])))
print()

# ── TEST 2: LEGITIMATE JOB
print('TEST 2: Legitimate Job')
print('=' * 40)
body2 = {
    'input_type': 'text',
    'content': 'Wipro Limited is hiring Software Engineers in Bengaluru. Responsibilities include developing scalable applications and participating in code reviews. Requirements: BTech Computer Science, 2 years experience in Java and Spring Boot. Salary range 15-25 LPA. Apply at careers.wipro.com with your updated resume.'
}
r2 = requests.post(url, json=body2)
d2 = r2.json()
print('Score:', d2.get('fraud_score'))
print('Risk:', d2.get('risk_level'))
print('Red Flags:', len(d2.get('signals_fired', [])))
print()

# ── TEST 3: SUBTLE SCAM
print('TEST 3: Subtle Scam Job')
print('=' * 40)
body3 = {
    'input_type': 'text',
    'content': 'Customer care executive needed urgently. Work from home opportunity. Salary 60000 per month. Freshers welcome no experience required. Contact us on Gmail only. Apply fast limited seats closing soon.'
}
r3 = requests.post(url, json=body3)
d3 = r3.json()
print('Score:', d3.get('fraud_score'))
print('Risk:', d3.get('risk_level'))
print('Red Flags:', len(d3.get('signals_fired', [])))
print()

print('All tests complete!')
