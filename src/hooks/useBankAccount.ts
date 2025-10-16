import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BankAccountService } from '@/services/api/bankAccountService'
import { BankAccountData } from '@/types/bankAccount'

// Hook for validating bank account
export function useValidateBankAccount() {
  return useMutation({
    mutationFn: (accountNumber: string) => BankAccountService.validateAccount(accountNumber),
    onSuccess: (data, accountNumber) => {
    //  success message
    },
    onError: (error, accountNumber) => {
      throw error
    }
  })
}

// Hook for saving single bank account
export function useSaveBankAccount() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (bankAccountData: BankAccountData) => BankAccountService.saveBankAccount(bankAccountData),
    onSuccess: (data, bankAccountData) => {
      
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })
    },
    onError: (error, bankAccountData) => {
      throw error
    }
  })
}

// Hook for saving multiple bank accounts
export function useSaveMultipleBankAccounts() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (bankAccounts: BankAccountData[]) => BankAccountService.saveMultipleBankAccounts(bankAccounts),
    onSuccess: (data, bankAccounts) => {
     
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })
    },
    onError: (error, bankAccounts) => {
      throw error
    }
  })
}
