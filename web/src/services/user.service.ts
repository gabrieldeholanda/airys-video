import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User, PersonalDetails, BusinessDetails, UserPreferences } from '../types/user';

export class UserService {
  private static readonly COLLECTION = 'users';

  static async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, this.COLLECTION, userId));
      if (!userDoc.exists()) return null;
      return userDoc.data() as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async updateUserProfile(
    userId: string,
    data: Partial<User>
  ): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION, userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async updatePersonalDetails(
    userId: string,
    details: Partial<PersonalDetails>
  ): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION, userId);
      await updateDoc(userRef, {
        personalDetails: details,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating personal details:', error);
      throw error;
    }
  }

  static async updateBusinessDetails(
    userId: string,
    details: Partial<BusinessDetails>
  ): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION, userId);
      await updateDoc(userRef, {
        businessDetails: details,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating business details:', error);
      throw error;
    }
  }

  static async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION, userId);
      await updateDoc(userRef, {
        preferences,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  static async createUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION, userId);
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUserPhoto(userId: string, photoURL: string): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION, userId);
      await updateDoc(userRef, {
        photoURL,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user photo:', error);
      throw error;
    }
  }

  static async updateEmailVerificationStatus(
    userId: string,
    isEmailVerified: boolean
  ): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION, userId);
      await updateDoc(userRef, {
        isEmailVerified,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating email verification status:', error);
      throw error;
    }
  }
} 