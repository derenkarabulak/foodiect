import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
import joblib

# Load datasets
exercise_df = pd.read_csv('./exercise.csv')
calorie_df = pd.read_csv('./calories.csv')

# Merge datasets on User_ID
merged_df = pd.merge(exercise_df, calorie_df, on='User_ID')

# Drop User_ID as it's not needed for training
merged_df.drop('User_ID', axis=1, inplace=True)

# Convert categorical variable 'Gender' to numeric
merged_df['Gender'] = merged_df['Gender'].map({'male': 1, 'female': 0})

# Split data into features and target
X = merged_df.drop('Calories', axis=1)
y = merged_df['Calories']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize the data
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# XGBoost
import xgboost as xgb

xgb_model = xgb.XGBRegressor(n_estimators=100, random_state=42)
xgb_model.fit(X_train, y_train)
y_pred_xgb = xgb_model.predict(X_test)
mse_xgb = mean_squared_error(y_test, y_pred_xgb)
print(f'XGBoost Mean Squared Error: {mse_xgb}')
joblib.dump(xgb_model, 'xgboost_model.pkl')
