export const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'rounded-md bg-[#00DC821A] border border-[#00DC8240] text-[#00A155] font-sans text-sm not-italic font-medium leading-4'
    case 'rejected':
      return 'rounded-md bg-[#FB2C361A] border border-[#FB2C3626] text-[#FB2C36] font-sans text-sm not-italic font-medium leading-4'
    case 'incomplete':
      return 'rounded-md bg-[rgba(239,177,0,0.10)] text-[#EFB100] border border-[#EFB10040] font-sans text-sm not-italic font-medium leading-4'
    case 'in review':
      return 'rounded-md bg-[#F1F5F9] text-[#314158] border border-[#CAD5E2] font-sans text-sm not-italic font-medium leading-4'
    case 'partial payment':
      return 'rounded-md bg-[#3B82F61A] border border-[#3B82F640] text-[#3B82F6] font-sans text-sm not-italic font-medium leading-4'
    default:
      return 'rounded-md bg-[#F1F5F9] text-[#314158] border border-[#CAD5E2] font-sans text-sm not-italic font-medium leading-4'
  }
}

export const getStatusDotColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-[#00A155]'
    case 'rejected':
      return 'bg-[#FB2C36]'
    case 'incomplete':
      return 'bg-[#EFB100]'
    case 'in review':
      return 'bg-[#314158]'
    case 'partial payment':
      return 'bg-[#3B82F6]'
    default:
      return 'bg-[#314158]'
  }
}

export const getStatusCardConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'rejected':
      return {
        color: 'bg-[#FB2C361A] border border-[#FB2C3626]',
        textColor: 'text-[#FB2C36]',
        dotColor: 'bg-[#FB2C36]',
      }
    case 'incomplete':
      return {
        color: 'bg-[#EFB1001A] border border-[#EFB10040]',
        textColor: 'text-[#EFB100]',
        dotColor: 'bg-[#EFB100]',
      }
    case 'in review':
      return {
        color: 'bg-[#E5E7EB] border border-[#D1D5DB]',
        textColor: 'text-[#1E2939]',
        dotColor: 'bg-[#1E2939]',
      }
    case 'partial payment':
      return {
        color: 'bg-[#3B82F61A] border border-[#3B82F640]',
        textColor: 'text-[#3B82F6]',
        dotColor: 'bg-[#3B82F6]',
      }
    case 'approved':
      return {
        color: 'bg-[#00DC821A] border border-[#00DC8240]',
        textColor: 'text-[#00A155]',
        dotColor: 'bg-[#00A155]',
      }
    default:
      return {
        color: 'bg-[#F1F5F9] border border-[#CAD5E2]',
        textColor: 'text-[#314158]',
        dotColor: 'bg-[#314158]',
      }
  }
}