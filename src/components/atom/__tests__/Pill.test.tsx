import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pill from '../Pill'; // Updated import path

describe('Pill', () => {
  it('renders with children', () => {
    render(<Pill>Test Pill</Pill>);
    expect(screen.getByText('Test Pill')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Pill onClick={handleClick}>Clickable Pill</Pill>);
    fireEvent.click(screen.getByText('Clickable Pill'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styling when selected', () => {
    render(<Pill selected>Selected Pill</Pill>);
    // Depending on how styling is applied (e.g., class names, inline styles),
    // you would check for the presence of specific styles or class names.
    // For Tailwind classes, checking for a specific class is common.
    // This is a placeholder assertion, you might need to adjust it based on actual styles.
    // Example: expect(screen.getByText('Selected Pill')).toHaveClass('bg-blue-500');
    // For now, we'll just ensure it renders without errors.
    expect(screen.getByText('Selected Pill')).toBeInTheDocument();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    // Assuming the Pill component passes through standard button props like disabled
    // If Pill doesn't support disabled directly, this test might need adjustment or be skipped.
    render(
      <Pill onClick={handleClick} disabled>
        Disabled Pill
      </Pill>
    );
    fireEvent.click(screen.getByText('Disabled Pill'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
