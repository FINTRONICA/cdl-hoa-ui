import React from 'react';
import DocumentUploadFactory from '../../DocumentUpload/DocumentUploadFactory';
import { DocumentItem } from '../developerTypes';

interface DocumentUploadStepProps {
  buildPartnerId: string;
  onDocumentsChange?: (documents: DocumentItem[]) => void;
  isOptional?: boolean;
  isReadOnly?: boolean;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ 
  buildPartnerId, 
  onDocumentsChange,
  isOptional = true,
  isReadOnly = false
}) => {
  return (
    <DocumentUploadFactory
      type="ASSET_REGISTER"
      entityId={buildPartnerId}
      isOptional={isOptional}
      {...(onDocumentsChange && { onDocumentsChange })}
      formFieldName="documents"
    />
  );
};

export default DocumentUploadStep;
