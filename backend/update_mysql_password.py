#!/usr/bin/env python3
"""Update MySQL password in .env file"""
import re
import sys
import urllib.parse

def update_env_file(password):
    """Update DATABASE_URL in .env file with new password"""
    env_file = ".env"
    
    try:
        # URL-encode the password to handle special characters like @
        encoded_password = urllib.parse.quote(password, safe='')
        
        # Read current .env file
        with open(env_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the password in DATABASE_URL
        # Pattern: mysql+pymysql://root:OLD_PASSWORD@localhost:3306/jack_ka_bank
        pattern = r'(DATABASE_URL=mysql\+pymysql://root:)([^@]+)(@localhost:3306/jack_ka_bank)'
        
        if re.search(pattern, content):
            new_content = re.sub(pattern, rf'\1{encoded_password}\3', content)
            
            # Write back to file
            with open(env_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"[SUCCESS] Updated .env file with new MySQL password!")
            print(f"[INFO] DATABASE_URL now uses password: {password}")
            return True
        else:
            print("[ERROR] Could not find DATABASE_URL in .env file")
            return False
            
    except FileNotFoundError:
        print(f"[ERROR] .env file not found at {env_file}")
        return False
    except Exception as e:
        print(f"[ERROR] Failed to update .env file: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        password = sys.argv[1]
        update_env_file(password)
    else:
        print("Usage: python update_mysql_password.py YOUR_PASSWORD")
        print("\nOr enter password when prompted:")
        password = input("Enter MySQL root password: ").strip()
        if password:
            update_env_file(password)
        else:
            print("[ERROR] Password cannot be empty")
