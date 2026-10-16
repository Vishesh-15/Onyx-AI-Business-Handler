export const caClients = [
  { id: 1, name: 'Amit Verma', phone: '+91 98100 11234', email: 'amit.verma@gmail.com', gstNo: '07AABCU9603R1ZX', pan: 'AABCU9603R', status: 'filed', type: 'Individual', pendingDocs: 0 },
  { id: 2, name: 'Priya Mehta', phone: '+91 99200 22345', email: 'priya.mehta@gmail.com', gstNo: '07AADCP4567K1ZY', pan: 'AADCP4567K', status: 'pending', type: 'Individual', pendingDocs: 2 },
  { id: 3, name: 'Sunrise Traders', phone: '+91 98300 33456', email: 'accounts@sunrisetraders.in', gstNo: '07AACCS1234M1ZZ', pan: 'AACCS1234M', status: 'in_progress', type: 'Business', pendingDocs: 1 },
  { id: 4, name: 'Rakesh Gupta', phone: '+91 97400 44567', email: 'rakesh.gupta@yahoo.com', gstNo: '07AAECR8901P1ZW', pan: 'AAECR8901P', status: 'pending', type: 'Individual', pendingDocs: 3 },
  { id: 5, name: 'Kapoor & Sons', phone: '+91 96500 55678', email: 'info@kapoorandsons.com', gstNo: '07AABCK7654Q1ZV', pan: 'AABCK7654Q', status: 'filed', type: 'Business', pendingDocs: 0 },
  { id: 6, name: 'Neha Singh', phone: '+91 95600 66789', email: 'neha.singh@gmail.com', gstNo: null, pan: 'AADNS3210R', status: 'overdue', type: 'Individual', pendingDocs: 4 },
  { id: 7, name: 'TechBuild Pvt Ltd', phone: '+91 94700 77890', email: 'finance@techbuild.in', gstNo: '07AACCT5678R1ZU', pan: 'AACCT5678R', status: 'in_progress', type: 'Business', pendingDocs: 1 },
  { id: 8, name: 'Mohan Lal', phone: '+91 93800 88901', email: 'mohanlal@hotmail.com', gstNo: null, pan: 'AABCM4321S', status: 'filed', type: 'Individual', pendingDocs: 0 },
];

export const deadlines = [
  { id: 1, title: 'GSTR-1 Filing', clientId: 3, client: 'Sunrise Traders', dueDate: '2025-05-31', type: 'GST', status: 'upcoming', description: 'Monthly GSTR-1 for April 2025' },
  { id: 2, title: 'GSTR-3B Filing', clientId: 7, client: 'TechBuild Pvt Ltd', dueDate: '2025-05-25', type: 'GST', status: 'due_today', description: 'Monthly GSTR-3B for April 2025' },
  { id: 3, title: 'ITR Filing', clientId: 2, client: 'Priya Mehta', dueDate: '2025-05-20', type: 'ITR', status: 'overdue', description: 'FY 2024-25 ITR filing' },
  { id: 4, title: 'ITR Filing', clientId: 4, client: 'Rakesh Gupta', dueDate: '2025-05-18', type: 'ITR', status: 'overdue', description: 'FY 2024-25 ITR filing' },
  { id: 5, title: 'TDS Return', clientId: 5, client: 'Kapoor & Sons', dueDate: '2025-06-07', type: 'TDS', status: 'upcoming', description: 'Q4 TDS return filing' },
  { id: 6, title: 'GSTR-1 Filing', clientId: 7, client: 'TechBuild Pvt Ltd', dueDate: '2025-06-11', type: 'GST', status: 'upcoming', description: 'Monthly GSTR-1 for May 2025' },
  { id: 7, title: 'ITR Filing', clientId: 6, client: 'Neha Singh', dueDate: '2025-05-15', type: 'ITR', status: 'overdue', description: 'FY 2024-25 ITR — docs missing' },
  { id: 8, title: 'Advance Tax', clientId: 3, client: 'Sunrise Traders', dueDate: '2025-06-15', type: 'Tax', status: 'upcoming', description: 'Q1 advance tax payment' },
];

export const documents = [
  {
    clientId: 2, client: 'Priya Mehta',
    checklist: [
      { id: 1, name: 'PAN Card', received: true },
      { id: 2, name: 'Aadhaar Card', received: true },
      { id: 3, name: 'Form 16', received: false },
      { id: 4, name: 'Bank Statement', received: false },
      { id: 5, name: 'Investment Proofs', received: true },
    ]
  },
  {
    clientId: 3, client: 'Sunrise Traders',
    checklist: [
      { id: 1, name: 'GST Invoices', received: true },
      { id: 2, name: 'Purchase Register', received: true },
      { id: 3, name: 'Bank Statement', received: false },
      { id: 4, name: 'Expense Vouchers', received: true },
    ]
  },
  {
    clientId: 4, client: 'Rakesh Gupta',
    checklist: [
      { id: 1, name: 'PAN Card', received: true },
      { id: 2, name: 'Form 16', received: false },
      { id: 3, name: 'Bank Statement', received: false },
      { id: 4, name: 'Rental Income Proof', received: false },
      { id: 5, name: 'Investment Proofs', received: true },
    ]
  },
  {
    clientId: 6, client: 'Neha Singh',
    checklist: [
      { id: 1, name: 'PAN Card', received: false },
      { id: 2, name: 'Aadhaar Card', received: true },
      { id: 3, name: 'Form 16', received: false },
      { id: 4, name: 'Bank Statement', received: false },
      { id: 5, name: 'Investment Proofs', received: false },
    ]
  },
  {
    clientId: 7, client: 'TechBuild Pvt Ltd',
    checklist: [
      { id: 1, name: 'GST Invoices', received: true },
      { id: 2, name: 'Purchase Register', received: true },
      { id: 3, name: 'Bank Statement', received: true },
      { id: 4, name: 'Salary Register', received: false },
    ]
  },
];

export const caStats = {
  totalClients: 8,
  filedThisMonth: 3,
  pendingFilings: 3,
  overdueFilings: 3,
  docsAwaited: 4,
};