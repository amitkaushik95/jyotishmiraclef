/**
 * Calculation Utilities
 * Age calculation, date formatting, etc.
 */

/**
 * Calculate age from DOB (MMDDYY format)
 * Returns age, year, and zodiac year insight
 */
export function calculateAge(dobMMDDYY) {
    if (!dobMMDDYY || dobMMDDYY.length !== 6) return null;
    
    const month = parseInt(dobMMDDYY.substring(0, 2));
    const day = parseInt(dobMMDDYY.substring(2, 4));
    const yearSuffix = parseInt(dobMMDDYY.substring(4, 6));
    
    // Smart year detection: if year suffix is > 50, assume 19XX, else 20XX
    const year = yearSuffix > 50 
        ? parseInt('19' + String(yearSuffix).padStart(2, '0')) 
        : parseInt('20' + String(yearSuffix).padStart(2, '0'));
    
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    
    // Validate date
    if (isNaN(birthDate.getTime())) return null;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    // Calculate zodiac year (Vedic astrology - 12-year cycle)
    const zodiacYear = ((year - 4) % 12);
    const zodiacSigns = [
        'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
        'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
    ];
    
    return {
        age: age,
        year: birthDate.getFullYear(),
        zodiacYear: zodiacSigns[zodiacYear],
        birthDate: birthDate
    };
}

/**
 * Format DOB from MMDDYY to readable format
 */
export function formatDOB(dobMMDDYY) {
    if (!dobMMDDYY || dobMMDDYY.length !== 6) return dobMMDDYY;
    
    const month = dobMMDDYY.substring(0, 2);
    const day = dobMMDDYY.substring(2, 4);
    const year = dobMMDDYY.substring(4, 6);
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthIndex = parseInt(month) - 1;
    if (monthIndex < 0 || monthIndex > 11) return dobMMDDYY;
    
    return `${monthNames[monthIndex]} ${parseInt(day)}, 19${year}`;
}

/**
 * Validate DOB format (MMDDYY)
 */
export function validateDOB(dobMMDDYY) {
    if (!dobMMDDYY || dobMMDDYY.length !== 6) return false;
    if (!/^\d{6}$/.test(dobMMDDYY)) return false;
    
    const month = parseInt(dobMMDDYY.substring(0, 2));
    const day = parseInt(dobMMDDYY.substring(2, 4));
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    return true;
}
