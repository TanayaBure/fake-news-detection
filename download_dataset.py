import kagglehub
import shutil
import os
import pandas as pd

print("Downloading dataset using kagglehub...")
# Download latest version
path = kagglehub.dataset_download("clmentbisaillon/fake-and-real-news-dataset")

print("Path to downloaded dataset files:", path)

# Move the files to the current directory
for file in os.listdir(path):
    if file.endswith('.csv'):
        shutil.copy(os.path.join(path, file), '.')
        print(f"Copied {file} to current directory")

# Combine True.csv and Fake.csv into train.csv
print("Combining True.csv and Fake.csv into train.csv...")
fake_df = pd.read_csv('Fake.csv')
fake_df['label'] = 1 # Fake

true_df = pd.read_csv('True.csv')
true_df['label'] = 0 # True

merged_df = pd.concat([fake_df, true_df], ignore_index=True)
# Shuffle the dataset
merged_df = merged_df.sample(frac=1, random_state=42).reset_index(drop=True)

# Save as train.csv
merged_df.to_csv('train.csv', index=False)
print("Successfully created train.csv! You can now use it in the Streamlit app.")
