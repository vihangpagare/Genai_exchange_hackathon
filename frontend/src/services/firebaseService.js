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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../providers/firebase';

class FirebaseService {
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
