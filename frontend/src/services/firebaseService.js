import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  listAll,
  getMetadata
} from 'firebase/storage';
import { db, auth } from '../providers/firebase';

const storage = getStorage();

class FirebaseService {
  // Authentication
  getCurrentUser() {
    return auth.currentUser;
  }

  // Users Collection
  async createUser(userData) {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Startups Collection
  async createStartup(startupData) {
    try {
      const docRef = await addDoc(collection(db, 'startups'), {
        ...startupData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating startup:', error);
      throw error;
    }
  }

  async saveStartup(startupData) {
    try {
      // Check if startup already exists
      const existingStartup = await this.findStartupByUserId(startupData.userId);
      
      if (existingStartup) {
        // Update existing startup
        const docRef = doc(db, 'startups', existingStartup.id);
        await updateDoc(docRef, {
          ...startupData,
          updatedAt: serverTimestamp()
        });
        return existingStartup.id;
      } else {
        // Create new startup
        return await this.createStartup(startupData);
      }
    } catch (error) {
      console.error('Error saving startup:', error);
      throw error;
    }
  }

  async findStartupByUserId(userId) {
    try {
      const q = query(collection(db, 'startups'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      
      return null;
    } catch (error) {
      console.error('Error finding startup by user ID:', error);
      throw error;
    }
  }

  async getStartup(startupId) {
    try {
      const docRef = doc(db, 'startups', startupId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Startup not found');
      }
    } catch (error) {
      console.error('Error getting startup:', error);
      throw error;
    }
  }

  async getAllStartups() {
    try {
      const q = query(collection(db, 'startups'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const startups = [];
      
      querySnapshot.forEach((doc) => {
        startups.push({ id: doc.id, ...doc.data() });
      });
      
      return startups;
    } catch (error) {
      console.error('Error getting startups:', error);
      throw error;
    }
  }

  // Investors Collection
  async createInvestor(investorData) {
    try {
      const docRef = await addDoc(collection(db, 'investors'), {
        ...investorData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating investor:', error);
      throw error;
    }
  }

  async saveInvestor(investorData) {
    try {
      // Check if investor already exists
      const existingInvestor = await this.findInvestorByUserId(investorData.userId);
      
      if (existingInvestor) {
        // Update existing investor
        const docRef = doc(db, 'investors', existingInvestor.id);
        await updateDoc(docRef, {
          ...investorData,
          updatedAt: serverTimestamp()
        });
        return existingInvestor.id;
      } else {
        // Create new investor
        return await this.createInvestor(investorData);
      }
    } catch (error) {
      console.error('Error saving investor:', error);
      throw error;
    }
  }

  async findInvestorByUserId(userId) {
    try {
      const q = query(collection(db, 'investors'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      
      return null;
    } catch (error) {
      console.error('Error finding investor by user ID:', error);
      throw error;
    }
  }

  async getInvestor(investorId) {
    try {
      const docRef = doc(db, 'investors', investorId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Investor not found');
      }
    } catch (error) {
      console.error('Error getting investor:', error);
      throw error;
    }
  }

  // Get all investors (for startup listing)
  async getAllInvestors() {
    try {
      const q = query(collection(db, 'investors'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const investors = [];
      
      querySnapshot.forEach((doc) => {
        investors.push({ id: doc.id, ...doc.data() });
      });
      
      return investors;
    } catch (error) {
      console.error('Error getting all investors:', error);
      throw error;
    }
  }

  async updateStartup(startupId, updateData) {
    try {
      const docRef = doc(db, 'startups', startupId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating startup:', error);
      throw error;
    }
  }

  // Documents Collection
  async createDocument(startupId, documentData) {
    try {
      const docRef = await addDoc(collection(db, 'documents'), {
        startupId,
        ...documentData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Firebase Storage Methods
  async uploadFile(file, path, onProgress = null) {
    try {
      
      const storageRef = ref(storage, path);
      
      if (onProgress) {
        // Upload with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(progress);
            },
            (error) => {
              console.error('Firebase Storage: Upload error:', error);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({
                  url: downloadURL,
                  path: path,
                  name: file.name,
                  size: file.size,
                  type: file.type
                });
              } catch (error) {
                console.error('Firebase Storage: Error getting download URL:', error);
                reject(error);
              }
            }
          );
        });
      } else {
        // Simple upload without progress
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          url: downloadURL,
          path: path,
          name: file.name,
          size: file.size,
          type: file.type
        };
      }
    } catch (error) {
      console.error('Firebase Storage: Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(path) {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async uploadStartupDocument(file, startupId, category = 'general', onProgress) {
    try {
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${file.name.replace(/\.[^/.]+$/, "")}_${timestamp}`;
      const path = `startups/${startupId}/documents/${category}/${fileName}.${fileExtension}`;
      
      const uploadResult = await this.uploadFile(file, path, onProgress);
      
      // Save document metadata to Firestore
      const documentData = {
        startupId,
        category,
        fileName: file.name,
        storagePath: path,
        downloadURL: uploadResult.url,
        fileSize: file.size,
        fileType: file.type,
        createdAt: serverTimestamp(),
        uploadedAt: serverTimestamp()
      };
      
      const docId = await this.createDocument(startupId, documentData);
      
      return {
        id: docId,
        ...documentData,
        ...uploadResult
      };
    } catch (error) {
      console.error('Error uploading startup document:', error);
      throw error;
    }
  }

  async uploadPitchDeck(file, startupId, onProgress) {
    return this.uploadStartupDocument(file, startupId, 'pitch_deck', onProgress);
  }

  async uploadFinancialProjections(file, startupId) {
    return this.uploadStartupDocument(file, startupId, 'financial_projections');
  }

  async uploadBusinessPlan(file, startupId) {
    return this.uploadStartupDocument(file, startupId, 'business_plan');
  }

  async uploadOtherDocument(file, startupId) {
    return this.uploadStartupDocument(file, startupId, 'other');
  }

  async getDocumentsByStartup(startupId) {
    try {
      const q = query(
        collection(db, 'documents'), 
        where('startupId', '==', startupId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Test function to debug Storage access
  async testStorageAccess(startupId) {
    try {
      console.log(`🧪 Testing Storage access for startup: ${startupId}`);
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('❌ No authenticated user found');
        return false;
      }
      
      console.log(`👤 Current user: ${currentUser.uid}`);
      console.log(`🔑 User token: ${currentUser.accessToken ? 'Present' : 'Missing'}`);
      
      // Test basic Storage access
      const testPath = `startups/${startupId}/`;
      const testRef = ref(storage, testPath);
      
      console.log(`📁 Testing access to: ${testPath}`);
      console.log(`🔐 Storage reference: ${testRef.fullPath}`);
      
      try {
        const listResult = await listAll(testRef);
        console.log(`✅ Storage access successful! Found ${listResult.items.length} items`);
        return true;
      } catch (error) {
        console.error('❌ Storage access failed:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Test function error:', error);
      return false;
    }
  }

  // Pitch Deck Management
  async getPitchDeck(startupId) {
    try {
      console.log(`🔍 Fetching pitch deck from Storage for startup: ${startupId}`);
      
      // First, let's check if the user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('❌ No authenticated user found');
        throw new Error('User not authenticated');
      }
      
      console.log(`👤 Current user: ${currentUser.uid}`);
      console.log(`🔑 User token: ${currentUser.accessToken ? 'Present' : 'Missing'}`);
      
      // Check if startupId matches current user
      if (startupId !== currentUser.uid) {
        console.warn(`⚠️ StartupId (${startupId}) doesn't match current user (${currentUser.uid})`);
      }
      
      // List files in the startup's pitch deck folder
      const pitchDeckPath = `startups/${startupId}/documents/pitch_deck/`;
      const listRef = ref(storage, pitchDeckPath);
      
      console.log(`📁 Listing files in: ${pitchDeckPath}`);
      console.log(`🔐 Storage reference: ${listRef.fullPath}`);
      
      try {
        const listResult = await listAll(listRef);
        console.log(`📊 List result: ${listResult.items.length} items found`);
        
        if (listResult.items.length > 0) {
        // Get the most recent pitch deck file
        const pitchDeckFile = listResult.items[0];
        console.log(`📄 Found pitch deck file: ${pitchDeckFile.name}`);
        
        // Get download URL
        const downloadURL = await getDownloadURL(pitchDeckFile);
        
        // Get file metadata
        const metadata = await getMetadata(pitchDeckFile);
        
        console.log('✅ Pitch deck found in Storage:', {
          name: pitchDeckFile.name,
          size: metadata.size,
          contentType: metadata.contentType,
          downloadURL: downloadURL
        });
        
        return {
          id: pitchDeckFile.name,
          fileName: pitchDeckFile.name,
          fileType: metadata.contentType,
          fileSize: metadata.size,
          downloadURL: downloadURL,
          storagePath: pitchDeckFile.fullPath,
          createdAt: metadata.timeCreated,
          updatedAt: metadata.updated
        };
        } else {
          console.log('ℹ️ No pitch deck found in Storage');
          return null;
        }
      } catch (listError) {
        console.error('❌ Error listing files in Storage:', listError);
        console.error('❌ Error code:', listError.code);
        console.error('❌ Error message:', listError.message);
        
        // Check if it's a permission error
        if (listError.code === 'storage/unauthorized') {
          console.error('🔒 Permission denied - user may not have access to this path');
          throw new Error('Permission denied. Please check your Firebase rules and make sure you are logged in.');
        }
        
        // For other errors, return null so analysis can continue
        return null;
      }
    } catch (error) {
      console.error('Error fetching pitch deck from Storage:', error);
      // Don't throw error, just return null so analysis can continue
      return null;
    }
  }

  async deletePitchDeck(startupId, documentId) {
    try {
      // Get document data first
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Document not found');
      }
      
      const documentData = docSnap.data();
      
      // Delete from Firebase Storage
      if (documentData.storagePath) {
        const fileRef = ref(storage, documentData.storagePath);
        await deleteObject(fileRef);
      }
      
      // Delete from Firestore
      await deleteDoc(docRef);
      
      return true;
    } catch (error) {
      console.error('Error deleting pitch deck:', error);
      throw error;
    }
  }

  async replacePitchDeck(file, startupId, onProgress) {
    try {
      // Get existing pitch deck in parallel with upload preparation
      const [existingPitchDeck] = await Promise.all([
        this.getPitchDeck(startupId).catch(() => null) // Don't fail if no existing deck
      ]);
      
      // Upload new pitch deck first (this is the heavy operation)
      const newPitchDeck = await this.uploadPitchDeck(file, startupId, onProgress);
      
      // Delete old pitch deck in background (don't wait for it)
      if (existingPitchDeck) {
        this.deletePitchDeck(startupId, existingPitchDeck.id).catch(error => {
          console.error('Error deleting old pitch deck:', error);
          // Don't throw - the new upload succeeded
        });
      }
      
      return newPitchDeck;
    } catch (error) {
      console.error('Error replacing pitch deck:', error);
      throw error;
    }
  }

  // Analyses Collection
  async createAnalysis(startupId, documentId, analysisData) {
    try {
      const docRef = await addDoc(collection(db, 'analyses'), {
        startupId,
        documentId,
        ...analysisData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating analysis:', error);
      throw error;
    }
  }

  async getAnalysesByStartup(startupId) {
    try {
      const q = query(
        collection(db, 'analyses'), 
        where('startupId', '==', startupId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const analyses = [];
      
      querySnapshot.forEach((doc) => {
        analyses.push({ id: doc.id, ...doc.data() });
      });
      
      return analyses;
    } catch (error) {
      console.error('Error getting analyses:', error);
      throw error;
    }
  }

  async saveAnalysis(analysisData) {
    try {
      const docRef = await addDoc(collection(db, 'analyses'), {
        ...analysisData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
  }

  // Update or create analysis for a startup (single analysis per startup)
  async updateOrCreateAnalysis(startupId, analysisData) {
    try {
      console.log(`🔄 Updating or creating analysis for startup: ${startupId}`);
      
      // First, check if an analysis already exists for this startup
      const q = query(
        collection(db, 'analyses'), 
        where('startupId', '==', startupId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Update existing analysis
        const existingDoc = querySnapshot.docs[0];
        const docId = existingDoc.id;
        
        console.log(`📝 Updating existing analysis: ${docId}`);
        
        const updateData = {
          ...analysisData,
          updatedAt: serverTimestamp()
        };
        
        console.log(`📊 Updating analysis with data:`, updateData);
        
        await updateDoc(doc(db, 'analyses', docId), updateData);
        
        console.log(`✅ Updated analysis document: ${docId}`);
        return { id: docId, isUpdate: true };
      } else {
        // Create new analysis
        console.log(`🆕 Creating new analysis for startup: ${startupId}`);
        
        const docData = {
          startupId,
          ...analysisData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        console.log(`📊 Creating analysis with data:`, docData);
        
        const docRef = await addDoc(collection(db, 'analyses'), docData);
        
        console.log(`✅ Created analysis document: ${docRef.id}`);
        return { id: docRef.id, isUpdate: false };
      }
    } catch (error) {
      console.error('Error updating or creating analysis:', error);
      throw error;
    }
  }

  // Get single analysis for a startup
  async getAnalysisByStartup(startupId) {
    try {
      console.log(`🔍 Getting analysis for startup: ${startupId}`);
      
      const q = query(
        collection(db, 'analyses'), 
        where('startupId', '==', startupId)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log(`ℹ️ No analysis found for startup: ${startupId}`);
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const analysisData = { id: doc.id, ...doc.data() };
      
      console.log(`✅ Found analysis: ${doc.id}`);
      console.log(`📊 Analysis data structure:`, analysisData);
      console.log(`📊 Analysis data keys:`, Object.keys(analysisData));
      console.log(`📊 Analysis data.analysisData:`, analysisData.analysisData);
      
      return analysisData;
    } catch (error) {
      console.error('Error getting analysis by startup:', error);
      throw error;
    }
  }

  // Save individual analysis result
  async saveIndividualAnalysis(startupId, analysisType, analysisData) {
    try {
      console.log(`💾 Saving individual analysis: ${analysisType} for startup: ${startupId}`);
      
      const analysisRecord = {
        startupId: startupId,
        analysisType: analysisType,
        analysisData: analysisData,
        status: 'completed',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'individual_analyses'), analysisRecord);
      console.log(`✅ Individual analysis saved with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error(`Error saving individual analysis (${analysisType}):`, error);
      throw error;
    }
  }

  // Get individual analysis results for a startup
  async getIndividualAnalyses(startupId, analysisType = null) {
    try {
      console.log(`🔍 Fetching individual analyses for startup: ${startupId}`);
      
      let q = query(
        collection(db, 'individual_analyses'),
        where('startupId', '==', startupId),
        orderBy('createdAt', 'desc')
      );
      
      if (analysisType) {
        q = query(
          collection(db, 'individual_analyses'),
          where('startupId', '==', startupId),
          where('analysisType', '==', analysisType),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const analyses = [];
      
      querySnapshot.forEach((doc) => {
        analyses.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`📊 Found ${analyses.length} individual analyses`);
      return analyses;
    } catch (error) {
      console.error('Error fetching individual analyses:', error);
      throw error;
    }
  }

  // Financial Metrics Collection
  async createFinancialMetrics(startupId, metricsData) {
    try {
      const docRef = await addDoc(collection(db, 'financialMetrics'), {
        startupId,
        ...metricsData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating financial metrics:', error);
      throw error;
    }
  }

  async getFinancialMetricsByStartup(startupId) {
    try {
      const q = query(
        collection(db, 'financialMetrics'), 
        where('startupId', '==', startupId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const metrics = [];
      
      querySnapshot.forEach((doc) => {
        metrics.push({ id: doc.id, ...doc.data() });
      });
      
      return metrics;
    } catch (error) {
      console.error('Error getting financial metrics:', error);
      throw error;
    }
  }

  // Team Members Collection
  async createTeamMember(startupId, memberData) {
    try {
      const docRef = await addDoc(collection(db, 'teamMembers'), {
        startupId,
        ...memberData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  }

  async getTeamMembersByStartup(startupId) {
    try {
      const q = query(
        collection(db, 'teamMembers'), 
        where('startupId', '==', startupId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const members = [];
      
      querySnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() });
      });
      
      return members;
    } catch (error) {
      console.error('Error getting team members:', error);
      throw error;
    }
  }

  // Market Data Collection
  async createMarketData(startupId, marketData) {
    try {
      const docRef = await addDoc(collection(db, 'marketData'), {
        startupId,
        ...marketData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating market data:', error);
      throw error;
    }
  }

  async getMarketDataByStartup(startupId) {
    try {
      const q = query(
        collection(db, 'marketData'), 
        where('startupId', '==', startupId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      
      return data;
    } catch (error) {
      console.error('Error getting market data:', error);
      throw error;
    }
  }

  // Competitors Collection
  async createCompetitor(startupId, competitorData) {
    try {
      const docRef = await addDoc(collection(db, 'competitors'), {
        startupId,
        ...competitorData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating competitor:', error);
      throw error;
    }
  }

  async getCompetitorsByStartup(startupId) {
    try {
      const q = query(
        collection(db, 'competitors'), 
        where('startupId', '==', startupId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const competitors = [];
      
      querySnapshot.forEach((doc) => {
        competitors.push({ id: doc.id, ...doc.data() });
      });
      
      return competitors;
    } catch (error) {
      console.error('Error getting competitors:', error);
      throw error;
    }
  }

  // Comprehensive data saving for analysis results
  async saveAnalysisResults(analysisResult, startupName = null, documentFilename = null) {
    try {
      // Extract startup name from analysis if not provided
      if (!startupName) {
        startupName = this.extractStartupName(analysisResult);
      }
      
      if (!startupName) {
        startupName = "Unknown Startup";
      }

      // Create or get startup
      let startupId = await this.findStartupByName(startupName);
      if (!startupId) {
        startupId = await this.createStartup({
          name: startupName,
          description: this.extractDescription(analysisResult),
          industry: this.extractIndustry(analysisResult),
          stage: this.extractStage(analysisResult),
          location: this.extractLocation(analysisResult),
          foundedYear: this.extractFoundedYear(analysisResult)
        });
      }

      // Create document record if applicable
      let documentId = null;
      if (documentFilename && analysisResult.file_path) {
        documentId = await this.createDocument(startupId, {
          filename: documentFilename,
          filePath: analysisResult.file_path,
          fileType: analysisResult.document_type || 'unknown',
          fileSize: analysisResult.file_size,
          totalPages: analysisResult.total_pages,
          successfulAnalyses: analysisResult.successful_analyses,
          status: analysisResult.status || 'success'
        });
      }

      // Save main analysis
      const analysisId = await this.createAnalysis(startupId, documentId, {
        analysisType: analysisResult.document_type || 'unknown',
        analysisData: analysisResult,
        status: analysisResult.status || 'success',
        confidenceScore: this.calculateConfidenceScore(analysisResult)
      });

      // Extract and save structured data
      await this.extractAndSaveStructuredData(startupId, documentId, analysisResult);

      return { startupId, documentId, analysisId };
    } catch (error) {
      console.error('Error saving analysis results:', error);
      throw error;
    }
  }

  async findStartupByName(name) {
    try {
      const q = query(collection(db, 'startups'), where('name', '==', name));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }
      return null;
    } catch (error) {
      console.error('Error finding startup by name:', error);
      return null;
    }
  }

  async extractAndSaveStructuredData(startupId, documentId, analysisResult) {
    const textContent = this.getTextContent(analysisResult);
    
    // Extract financial metrics
    const financialMetrics = this.extractFinancialMetrics(textContent);
    for (const metric of financialMetrics) {
      await this.createFinancialMetrics(startupId, {
        documentId,
        ...metric
      });
    }

    // Extract team members
    const teamMembers = this.extractTeamMembers(textContent);
    for (const member of teamMembers) {
      await this.createTeamMember(startupId, {
        documentId,
        ...member
      });
    }

    // Extract market data
    const marketData = this.extractMarketData(textContent);
    for (const data of marketData) {
      await this.createMarketData(startupId, {
        documentId,
        ...data
      });
    }

    // Extract competitors
    const competitors = this.extractCompetitors(textContent);
    for (const competitor of competitors) {
      await this.createCompetitor(startupId, {
        documentId,
        ...competitor
      });
    }
  }

  // Helper methods for data extraction
  getTextContent(analysisResult) {
    const textParts = [];
    
    if (analysisResult.overall_summary) {
      textParts.push(analysisResult.overall_summary);
    }
    
    if (analysisResult.page_analyses) {
      for (const page of analysisResult.page_analyses) {
        if (page.analysis) {
          textParts.push(page.analysis);
        }
      }
    }
    
    if (analysisResult.analysis) {
      textParts.push(analysisResult.analysis);
    }
    
    return textParts.join(' ');
  }

  extractStartupName(analysisResult) {
    const textContent = this.getTextContent(analysisResult);
    const namePatterns = [
      /[Cc]ompany[:\s]*([A-Z][a-zA-Z\s&]+)/,
      /[Ss]tartup[:\s]*([A-Z][a-zA-Z\s&]+)/,
      /[Bb]usiness[:\s]*([A-Z][a-zA-Z\s&]+)/
    ];
    
    for (const pattern of namePatterns) {
      const matches = textContent.match(pattern);
      if (matches) {
        return matches[1].trim();
      }
    }
    
    return null;
  }

  extractDescription(analysisResult) {
    const textContent = this.getTextContent(analysisResult);
    const descPatterns = [
      /[Dd]escription[:\s]*([^.]{50,200})/,
      /[Oo]verview[:\s]*([^.]{50,200})/,
      /[Aa]bout[:\s]*([^.]{50,200})/
    ];
    
    for (const pattern of descPatterns) {
      const matches = textContent.match(pattern);
      if (matches) {
        return matches[1].trim();
      }
    }
    
    return null;
  }

  extractIndustry(analysisResult) {
    const textContent = this.getTextContent(analysisResult);
    const industries = [
      'fintech', 'healthtech', 'edtech', 'saas', 'ecommerce',
      'ai', 'machine learning', 'blockchain', 'cybersecurity',
      'biotech', 'cleantech', 'agtech', 'proptech'
    ];
    
    for (const industry of industries) {
      if (industry.toLowerCase() in textContent.toLowerCase()) {
        return industry.charAt(0).toUpperCase() + industry.slice(1);
      }
    }
    
    return null;
  }

  extractStage(analysisResult) {
    const textContent = this.getTextContent(analysisResult);
    const stages = ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth'];
    
    for (const stage of stages) {
      if (textContent.toLowerCase().includes(stage)) {
        return stage;
      }
    }
    
    return null;
  }

  extractLocation(analysisResult) {
    const textContent = this.getTextContent(analysisResult);
    const locationPatterns = [
      /[Ll]ocation[:\s]*([A-Z][a-zA-Z\s,]+)/,
      /[Bb]ased\s+in[:\s]*([A-Z][a-zA-Z\s,]+)/,
      /[Hh]eadquarters[:\s]*([A-Z][a-zA-Z\s,]+)/
    ];
    
    for (const pattern of locationPatterns) {
      const matches = textContent.match(pattern);
      if (matches) {
        return matches[1].trim();
      }
    }
    
    return null;
  }

  extractFoundedYear(analysisResult) {
    const textContent = this.getTextContent(analysisResult);
    const yearPatterns = [
      /[Ff]ounded[:\s]*([0-9]{4})/,
      /[Ee]stablished[:\s]*([0-9]{4})/,
      /[Ss]tarted[:\s]*([0-9]{4})/
    ];
    
    for (const pattern of yearPatterns) {
      const matches = textContent.match(pattern);
      if (matches) {
        return parseInt(matches[1]);
      }
    }
    
    return null;
  }

  calculateConfidenceScore(analysisResult) {
    let score = 0.5; // Base score
    
    if (analysisResult.overall_summary) {
      score += 0.2;
    }
    
    if (analysisResult.page_analyses) {
      const successfulPages = analysisResult.successful_analyses || 0;
      const totalPages = analysisResult.total_pages || 1;
      score += 0.3 * (successfulPages / totalPages);
    }
    
    return Math.min(score, 1.0);
  }

  extractFinancialMetrics(textContent) {
    const metrics = [];
    const patterns = {
      'MRR': /MRR[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?/gi,
      'ARR': /ARR[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?/gi,
      'Revenue': /[Rr]evenue[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?/gi,
      'CAC': /CAC[:\s]*\$?([0-9,]+(?:\.\d+)?)/gi,
      'LTV': /LTV[:\s]*\$?([0-9,]+(?:\.\d+)?)/gi,
      'Burn Rate': /[Bb]urn\s+[Rr]ate[:\s]*\$?([0-9,]+(?:\.\d+)?)/gi,
      'Runway': /[Rr]unway[:\s]*([0-9,]+(?:\.\d+)?)\s*(?:months?|years?)/gi,
      'Valuation': /[Vv]aluation[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?/gi
    };

    for (const [metricName, pattern] of Object.entries(patterns)) {
      const matches = [...textContent.matchAll(pattern)];
      for (const match of matches) {
        const value = this.parseNumericValue(match[1]);
        if (value) {
          metrics.push({
            metricName,
            metricValue: value,
            metricUnit: 'USD',
            confidence: 0.8
          });
        }
      }
    }

    return metrics;
  }

  extractTeamMembers(textContent) {
    const members = [];
    const patterns = [
      /([A-Z][a-z]+\s+[A-Z][a-z]+)[:\s]*(?:CEO|CTO|COO|Founder|Co-founder)/g,
      /(?:CEO|CTO|COO|Founder|Co-founder)[:\s]*([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
      /([A-Z][a-z]+\s+[A-Z][a-z]+)[:\s]*(?:VP|Director|Manager)/g
    ];

    for (const pattern of patterns) {
      const matches = [...textContent.matchAll(pattern)];
      for (const match of matches) {
        const name = match[1].trim();
        if (name.split(' ').length >= 2) {
          members.push({
            name,
            isFounder: pattern.source.includes('founder')
          });
        }
      }
    }

    return members;
  }

  extractMarketData(textContent) {
    const data = [];
    const patterns = {
      'TAM': /TAM[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?/gi,
      'SAM': /SAM[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?/gi,
      'SOM': /SOM[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?/gi,
      'Market Size': /[Mm]arket\s+[Ss]ize[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?/gi
    };

    for (const [dataType, pattern] of Object.entries(patterns)) {
      const matches = [...textContent.matchAll(pattern)];
      for (const match of matches) {
        const value = this.parseNumericValue(match[1]);
        if (value) {
          data.push({
            dataType,
            value,
            unit: 'USD',
            confidence: 0.8
          });
        }
      }
    }

    return data;
  }

  extractCompetitors(textContent) {
    const competitors = [];
    const patterns = [
      /[Cc]ompetitor[s]?[:\s]*([A-Z][a-zA-Z\s&]+)/g,
      /[Cc]ompeting\s+with[:\s]*([A-Z][a-zA-Z\s&]+)/g,
      /[Aa]lternative[s]?[:\s]*([A-Z][a-zA-Z\s&]+)/g
    ];

    for (const pattern of patterns) {
      const matches = [...textContent.matchAll(pattern)];
      for (const match of matches) {
        const name = match[1].trim();
        if (name.length > 2) {
          competitors.push({
            competitorName: name
          });
        }
      }
    }

    return competitors;
  }

  parseNumericValue(valueStr) {
    try {
      valueStr = valueStr.replace(/,/g, '');
      
      if (valueStr.endsWith('K')) {
        return parseFloat(valueStr.slice(0, -1)) * 1000;
      } else if (valueStr.endsWith('M')) {
        return parseFloat(valueStr.slice(0, -1)) * 1000000;
      } else if (valueStr.endsWith('B')) {
        return parseFloat(valueStr.slice(0, -1)) * 1000000000;
      } else {
        return parseFloat(valueStr);
      }
    } catch {
      return null;
    }
  }
}

export default new FirebaseService();
