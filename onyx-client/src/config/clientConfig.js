// This config will later come from Firestore based on UID
// For now — dummy config for CA firm client

const clientConfig = {
  uid: 'CA-1001-V',
  clientName: 'Sharma & Associates',
  clientType: 'ca_firm',
  themeColor: '#3a9e75',       // accent color — configurable per client
  darkMode: true,
  plan: 'standard',            // basic | standard | pro
  modules: [
    'dashboard',
    'clients',
    'deadlines',
    'documents',
    'reminders',
  ],
  owner: {
    name: 'Rajesh Sharma',
    email: 'rajesh@sharmaassociates.in',
  },
};

export default clientConfig;