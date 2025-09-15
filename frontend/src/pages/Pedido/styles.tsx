import styled from 'styled-components';

export const Container = styled.div`
  padding: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e7eb;
`;

export const TableHeader = styled.th`
  padding: 0.75rem;
  text-align: left;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  &:nth-child(even) {
    background-color: #f9fafb;
    
    &:hover {
      background-color: #f3f4f6;
    }
  }
`;

export const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const ExpandableRow = styled.tr`
  background-color: #f8fafc;
`;

export const ExpandableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const EditContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const Input = styled.input`
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  border-radius: 0.25rem;
  width: 120px;
`;

export const SaveButton = styled.button`
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background-color: #059669;
  }
`;

export const CancelButton = styled.button`
  background-color: #9ca3af;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background-color: #6b7280;
  }
`;

export const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const DepName = styled.div`
  font-weight: 600;
`;

export const DepFilial = styled.div`
  color: #6b7280;
`;

export const EditButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #2563eb;
  }
`;

export const EmptyMessage = styled.p`
  color: #6b7280;
  font-style: italic;
`;

export const ExpandIcon = styled.span<{ expanded: boolean }>`
  display: inline-block;
  width: 20px;
  text-align: center;
  color: #6b7280;
  transition: transform 0.2s;
  transform: ${props => props.expanded ? 'rotate(0deg)' : 'rotate(0deg)'};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const InfoLabel = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.25rem;
`;

export const InfoValue = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
`;


// ... outros estilos existentes ...

export const CardContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e8e8e8;
  }
`;

export const CardContent = styled.div`
  padding: 15px;
  background-color: #fff;
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const CardLabel = styled.span`
  font-weight: bold;
  color: #555;
`;

export const CardValue = styled.span`
  color: #333;
`;

export const CardCompetencia = styled.div`
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  min-width: 250px;
  background-color: #f9f9f9;
`;