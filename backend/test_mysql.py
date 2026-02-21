#!/usr/bin/env python3
"""Test MySQL connection and help update .env file"""
import pymysql
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def test_mysql_connection(password):
    """Test MySQL connection with given password"""
    try:
        conn = pymysql.connect(
            host='localhost',
            user='root',
            password=password,
            port=3306
        )
        print(f"[SUCCESS] Password '{password}' works!")
        
        # Check if database exists
        cursor = conn.cursor()
        cursor.execute("SHOW DATABASES")
        databases = [row[0] for row in cursor.fetchall()]
        
        if 'jack_ka_bank' in databases:
            print("[OK] Database 'jack_ka_bank' already exists!")
        else:
            print("[INFO] Database 'jack_ka_bank' does not exist. Creating it...")
            cursor.execute("CREATE DATABASE IF NOT EXISTS jack_ka_bank")
            print("[OK] Database 'jack_ka_bank' created!")
        
        conn.close()
        return True
    except pymysql.err.OperationalError as e:
        if "Access denied" in str(e):
            print(f"[X] Password '{password}' is incorrect")
        else:
            print(f"[X] Connection error: {e}")
        return False
    except Exception as e:
        print(f"[X] Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("MySQL Connection Tester")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        password = sys.argv[1]
        if test_mysql_connection(password):
            print(f"\n[INFO] Update your .env file with:")
            print(f"DATABASE_URL=mysql+pymysql://root:{password}@localhost:3306/jack_ka_bank")
    else:
        # Try common passwords automatically
        common_passwords = ["", "root", "password", "admin", "123456", "mysql", "Root@123", "root123"]
        print("\nTrying common passwords automatically...")
        found = False
        for pwd in common_passwords:
            print(f"\nTrying password: '{pwd if pwd else '(empty)'}'...")
            if test_mysql_connection(pwd):
                print(f"\n[SUCCESS] Found working password: '{pwd if pwd else '(empty)'}'")
                print(f"\n[INFO] Update your .env file with:")
                print(f"DATABASE_URL=mysql+pymysql://root:{pwd}@localhost:3306/jack_ka_bank")
                found = True
                break
        
        if not found:
            print("\n[X] None of the common passwords worked.")
            print("\n[INFO] To find/reset your MySQL password:")
            print("1. Open MySQL Command Line Client (search in Start menu)")
            print("2. Try logging in - it might prompt for password")
            print("3. Or use MySQL Workbench to reset the password")
            print("4. Or run this script with your password: python test_mysql.py YOUR_PASSWORD")
