import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create a simplified PropertyProjectData type that matches what we're passing from the form
interface PropertyProjectData {
  project_name: string;
  location: {
    city: string;
    province: string;
    country: string;
    latitude: string;
    longitude: string;
  };
  last_updated: string;
  property_details: {
    type: string;
    subtype: string;
    bedrooms: string;
    bathrooms: string;
    land_size: string;
    floor_area: string;
    amenities: string[];
  };
  price: string;
  description: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.5,
  },
  titleContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#166534",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 24,
    color: "#166534",
    marginBottom: 30,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#166534",
    borderLeftWidth: 4,
    borderLeftColor: "#166534",
    paddingLeft: 10,
  },
  subsectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    color: "#047857",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 8,
    paddingLeft: 15,
  },
  badge: {
    fontSize: 12,
    padding: 4,
    backgroundColor: "#f0fdf4",
    borderRadius: 4,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  footer: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    marginTop: 20,
  },
  // Appraisal specific styles
  appraisalHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#1e3a8a',
    textTransform: 'uppercase',
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
    paddingBottom: 5,
  },
  appraisalSubheader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e3a8a',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 3,
  },
  appraisalText: {
    fontSize: 11,
    marginBottom: 8,
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  appraisalTextBold: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appraisalTextItalic: {
    fontSize: 11,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  appraisalTable: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#94a3b8',
  },
  appraisalTableHeader: {
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    padding: 5,
    flexDirection: 'row',
  },
  appraisalTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 5,
  },
  appraisalTableCell: {
    flex: 1,
    padding: 4,
    fontSize: 10,
  },
  appraisalTableHeaderCell: {
    flex: 1,
    padding: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  appraisalNote: {
    fontSize: 9,
    fontStyle: 'italic',
    marginTop: 5,
    marginBottom: 10,
    color: '#64748b',
  },
  appraisalCitation: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 5,
  },
  appraisalFigure: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  appraisalFigureCaption: {
    fontSize: 9,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5,
    color: '#64748b',
  },
  appraisalHighlight: {
    backgroundColor: '#f0fdf4',
    padding: 8,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#166534',
  },
  appraisalWarning: {
    backgroundColor: '#fff7ed',
    padding: 8,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#c2410c',
  },
  appraisalBullet: {
    fontSize: 11,
    marginBottom: 5,
    paddingLeft: 15,
    lineHeight: 1.4,
  },
  appraisalPageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: '#64748b',
  },
  // Add new styles for branding
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#166534',
  },
  debmac: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});

interface ProjectReportPDFProps {
  projectData: PropertyProjectData;
  appraisalData: {
    market_data: {
      comparable_sales: string;
      active_listings: string;
      government_values: string;
    };
    purpose_of_appraisal: string;
    rental_income_potential: {
      monthly_rental_income: number;
      occupancy_rates: number;
    };
    valuation_process: {
      base_valuation: string;
      adjustment_factors: string;
      market_comparison: string;
      rental_income_valuation: string;
      aggregate_valuation: string;
      agent_fee: number;
    };
    proximity_data: {
      nearest_locations: string;
      festivals_events: string;
    };
  };
}

export function ProjectReportPDF({ projectData, appraisalData }: ProjectReportPDFProps) {
  // Helper function to format currency
  const formatCurrency = (amount: number | string) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.-]/g, '')) : amount;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(numericAmount);
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        {/* Header with branding */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              src="/images/filipino-world-logo.png"
              style={styles.logo}
            />
            <View>
              <Text style={styles.companyName}>Filipino World</Text>
              <Text style={styles.debmac}>DEBMAC</Text>
            </View>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{projectData.project_name}</Text>
          <Text style={styles.subtitle}>Comprehensive Property Appraisal Report</Text>
        </View>

        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.infoText}>
            Location: {projectData.location.city}, {projectData.location.province}, {projectData.location.country}
          </Text>
          <Text style={styles.infoText}>
            Property Type: {projectData.property_details.type || "Residential"} ({projectData.property_details.subtype})
          </Text>
          <Text style={styles.infoText}>
            Report Date: {new Date().toLocaleDateString()}
          </Text>
          <Text style={styles.infoText}>
            Coordinates: {projectData.location.latitude}, {projectData.location.longitude}
          </Text>
        </View>

        <View style={{ marginTop: 30, marginBottom: 30 }}>
          <Text style={[styles.appraisalText, { textAlign: 'center' }]}>
            This comprehensive property appraisal has been conducted in accordance with
            international real estate valuation standards, Philippine Valuation Standards (PVS),
            and local market conditions in {projectData.location.city}.
          </Text>
        </View>

        <View style={{
          backgroundColor: '#f0fdf4',
          padding: 15,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#166534',
          marginVertical: 20,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#166534', marginBottom: 8 }}>
            FINAL APPRAISED VALUE
          </Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#166534' }}>
            {formatCurrency(appraisalData.valuation_process.aggregate_valuation)}
          </Text>
        </View>

        <View style={styles.appraisalHighlight}>
          <Text style={styles.appraisalTextBold}>Professional Appraisal for:</Text>
          <Text style={styles.appraisalBullet}>• Purpose: {appraisalData.purpose_of_appraisal === "selling" ? "Property Sale and Market Listing" : appraisalData.purpose_of_appraisal}</Text>
          <Text style={styles.appraisalBullet}>• Agent Commission: {formatCurrency(appraisalData.valuation_process.agent_fee)} (5% of valuation)</Text>
          <Text style={styles.appraisalBullet}>• Market Positioning: Premium Residential Property</Text>
          <Text style={styles.appraisalBullet}>• Valuation Date: {new Date().toLocaleDateString()}</Text>
        </View>

        <Text style={styles.footer}>
          Last Updated: {new Date(projectData.last_updated).toLocaleDateString()}
          {' | '}Prepared by: Filipino World Real Estate Appraisal Division
        </Text>
      </Page>

      {/* Executive Summary Page */}
      <Page size="A4" style={styles.page}>
        {/* Header with branding */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              src="/images/filipino-world-logo.png"
              style={styles.logo}
            />
            <View>
              <Text style={styles.companyName}>Filipino World</Text>
              <Text style={styles.debmac}>DEBMAC</Text>
            </View>
          </View>
        </View>

        <Text style={styles.appraisalHeader}>EXECUTIVE SUMMARY</Text>

        <Text style={styles.appraisalText}>
          This detailed report presents a comprehensive property appraisal for {projectData.project_name}
          located in {projectData.location.city}, {projectData.location.province}, {projectData.location.country}.
          The appraisal employs a multi-criteria evaluation framework based on established real estate valuation
          methodologies, current market conditions, and the specific attributes of the subject property.
        </Text>

        <Text style={styles.appraisalText}>
          Our assessment incorporates comparative market analysis, income-based valuation methods, and
          detailed property feature evaluation to arrive at an accurate and defensible market value.
          The final valuation reflects both objective market data and qualitative factors affecting
          property desirability in this sought-after location.
        </Text>

        <View style={{
          backgroundColor: '#f0fdf4',
          padding: 15,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: '#166534',
          marginVertical: 15,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#166534', marginBottom: 5 }}>
            AGGREGATE VALUATION
          </Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#166534' }}>
            {formatCurrency(appraisalData.valuation_process.aggregate_valuation)}
          </Text>
        </View>

        <Text style={styles.appraisalSubheader}>Valuation Methodology</Text>

        <View style={styles.appraisalTable}>
          <View style={styles.appraisalTableHeader}>
            <Text style={[styles.appraisalTableHeaderCell, { flex: 2 }]}>Valuation Component</Text>
            <Text style={styles.appraisalTableHeaderCell}>Value</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Base Zonal Valuation</Text>
            <Text style={styles.appraisalTableCell}>{appraisalData.valuation_process.base_valuation}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Quality & Feature Adjustments</Text>
            <Text style={styles.appraisalTableCell}>{appraisalData.valuation_process.adjustment_factors}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Market-Based Valuation</Text>
            <Text style={styles.appraisalTableCell}>{appraisalData.valuation_process.market_comparison}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Annual Rental Income Potential</Text>
            <Text style={styles.appraisalTableCell}>{appraisalData.valuation_process.rental_income_valuation}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2, fontWeight: 'bold' }]}>Final Aggregate Valuation</Text>
            <Text style={[styles.appraisalTableCell, { fontWeight: 'bold' }]}>{formatCurrency(appraisalData.valuation_process.aggregate_valuation)}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Agent Commission (5%)</Text>
            <Text style={styles.appraisalTableCell}>{formatCurrency(appraisalData.valuation_process.agent_fee)}</Text>
          </View>
        </View>

        <Text style={styles.appraisalSubheader}>Property Overview</Text>
        <Text style={styles.appraisalText}>
          {projectData.description}
        </Text>

        <Text style={styles.appraisalPageNumber}>1</Text>
      </Page>

      {/* Property Details Page */}
      <Page size="A4" style={styles.page}>
        {/* Header with branding */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              src="/images/filipino-world-logo.png"
              style={styles.logo}
            />
            <View>
              <Text style={styles.companyName}>Filipino World</Text>
              <Text style={styles.debmac}>DEBMAC</Text>
            </View>
          </View>
        </View>

        <Text style={styles.appraisalHeader}>PROPERTY SPECIFICATIONS</Text>

        <Text style={styles.appraisalSubheader}>Core Property Details</Text>
        <View style={styles.appraisalTable}>
          <View style={styles.appraisalTableHeader}>
            <Text style={[styles.appraisalTableHeaderCell, { flex: 2 }]}>Feature</Text>
            <Text style={styles.appraisalTableHeaderCell}>Specification</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Property Type</Text>
            <Text style={styles.appraisalTableCell}>{projectData.property_details.type || "Residential House and Lot"}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Listing Type</Text>
            <Text style={styles.appraisalTableCell}>{projectData.property_details.subtype}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Bedrooms</Text>
            <Text style={styles.appraisalTableCell}>{projectData.property_details.bedrooms || 'N/A'}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Bathrooms</Text>
            <Text style={styles.appraisalTableCell}>{projectData.property_details.bathrooms || 'N/A'}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Land Size</Text>
            <Text style={styles.appraisalTableCell}>
              {projectData.property_details.land_size ? `${projectData.property_details.land_size} sqm` : 'N/A'}
            </Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Floor Area</Text>
            <Text style={styles.appraisalTableCell}>
              {projectData.property_details.floor_area ? `${projectData.property_details.floor_area} sqm` : 'N/A'}
            </Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Property Configuration</Text>
            <Text style={styles.appraisalTableCell}>3 Floors</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Parking Capacity</Text>
            <Text style={styles.appraisalTableCell}>4-6 Vehicles</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Staff Accommodation</Text>
            <Text style={styles.appraisalTableCell}>1 Maid&apos;s Room with private bathroom</Text>
          </View>
        </View>

        <Text style={styles.appraisalSubheader}>Structural Analysis & Material Quality</Text>
        <Text style={styles.appraisalText}>
          The property has been recently renovated with high-quality materials and fixtures.
          The structure is sound and well-maintained, with modern architectural elements that
          enhance both aesthetic appeal and functional utility. Key structural improvements include:
        </Text>

        <View style={styles.appraisalHighlight}>
          <Text style={styles.appraisalTextBold}>Recent Renovations:</Text>
          <Text style={styles.appraisalBullet}>• Complete electrical rewiring with modern safety features</Text>
          <Text style={styles.appraisalBullet}>• New plumbing throughout the property</Text>
          <Text style={styles.appraisalBullet}>• Full interior and exterior repainting</Text>
          <Text style={styles.appraisalBullet}>• New SPC Flooring in all bedrooms</Text>
          <Text style={styles.appraisalBullet}>• Premium fixtures from Kohler and Grohe</Text>
          <Text style={styles.appraisalBullet}>• Custom quartz kitchen countertops</Text>
        </View>

        {projectData.property_details.amenities && projectData.property_details.amenities.length > 0 && (
          <>
            <Text style={styles.appraisalSubheader}>Amenities & Premium Features</Text>
            <View style={[styles.appraisalHighlight, { marginBottom: 15 }]}>
              {projectData.property_details.amenities.map((amenity, index) => (
                <Text key={index} style={styles.appraisalBullet}>• {amenity}</Text>
              ))}
              <Text style={styles.appraisalBullet}>• Brand New Daikin 2.5 HP Split Type Air Conditioning</Text>
              <Text style={styles.appraisalBullet}>• Elba Rangehood</Text>
              <Text style={styles.appraisalBullet}>• Premium &quot;Kohler&quot; Water Fixtures</Text>
              <Text style={styles.appraisalBullet}>• &quot;Grohe&quot; Shower Fixtures</Text>
              <Text style={styles.appraisalBullet}>• Custom Built-in Closets</Text>
              <Text style={styles.appraisalBullet}>• Open Garden Lot</Text>
            </View>
          </>
        )}

        <Text style={styles.appraisalSubheader}>Location Quality Assessment</Text>
        <Text style={styles.appraisalText}>
          The property is situated in Hacienda Salinas, a secured gated subdivision in Lahug, Cebu City.
          This location offers an excellent balance of privacy, security, and accessibility to key urban amenities.
          The neighborhood is characterized by well-maintained properties and landscaped common areas,
          contributing to strong property value stability and growth potential.
        </Text>

        <Text style={styles.appraisalPageNumber}>2</Text>
      </Page>

      {/* Market Analysis Page */}
      <Page size="A4" style={styles.page}>
        {/* Header with branding */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              src="/images/filipino-world-logo.png"
              style={styles.logo}
            />
            <View>
              <Text style={styles.companyName}>Filipino World</Text>
              <Text style={styles.debmac}>DEBMAC</Text>
            </View>
          </View>
        </View>

        <Text style={styles.appraisalHeader}>COMPREHENSIVE MARKET ANALYSIS</Text>

        <Text style={styles.appraisalText}>
          This section presents a detailed analysis of current market conditions affecting
          property values in Lahug, Cebu City, with particular focus on premium residential
          properties similar to the subject property. Our analysis incorporates multiple data
          sources and valuation methodologies to ensure a comprehensive and accurate assessment.
        </Text>

        <Text style={[styles.appraisalSubheader, { marginTop: 15 }]}>Current Market Position</Text>
        <View style={{
          backgroundColor: '#f0fdf4',
          padding: 10,
          borderRadius: 4,
          borderLeftWidth: 4,
          borderLeftColor: '#166534',
          marginVertical: 10,
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#166534', marginBottom: 5 }}>
            FINAL VALUATION: {formatCurrency(appraisalData.valuation_process.aggregate_valuation)}
          </Text>
        </View>

        <Text style={styles.appraisalSubheader}>1. Comparable Sales Analysis</Text>
        <Text style={styles.appraisalText}>
          {appraisalData.market_data.comparable_sales}
        </Text>

        <View style={styles.appraisalTable}>
          <View style={styles.appraisalTableHeader}>
            <Text style={[styles.appraisalTableHeaderCell, { flex: 3 }]}>Comparable Property</Text>
            <Text style={[styles.appraisalTableHeaderCell, { flex: 2 }]}>Sale Price</Text>
            <Text style={styles.appraisalTableHeaderCell}>Price/sqm</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 3 }]}>4BR House in Lahug Heights (160sqm)</Text>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>₱18,500,000</Text>
            <Text style={styles.appraisalTableCell}>₱115,625</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 3 }]}>3BR Premium House near JY Square (145sqm)</Text>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>₱17,200,000</Text>
            <Text style={styles.appraisalTableCell}>₱118,620</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 3 }]}>5BR Luxury House in Cebu IT Park Area (180sqm)</Text>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>₱20,000,000</Text>
            <Text style={styles.appraisalTableCell}>₱111,111</Text>
          </View>
        </View>

        <Text style={styles.appraisalSubheader}>2. Active Listings</Text>
        <Text style={styles.appraisalText}>
          {appraisalData.market_data.active_listings}
        </Text>

        <View style={styles.appraisalTable}>
          <View style={styles.appraisalTableHeader}>
            <Text style={[styles.appraisalTableHeaderCell, { flex: 3 }]}>Active Listing</Text>
            <Text style={[styles.appraisalTableHeaderCell, { flex: 2 }]}>Asking Price</Text>
            <Text style={styles.appraisalTableHeaderCell}>Days on Market</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 3 }]}>4BR House in Hacienda Salinas (155sqm)</Text>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>₱19,500,000</Text>
            <Text style={styles.appraisalTableCell}>45</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 3 }]}>4BR Modern House near 32 Sanson (160sqm)</Text>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>₱20,500,000</Text>
            <Text style={styles.appraisalTableCell}>30</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 3 }]}>3BR Premium House in Lahug (140sqm)</Text>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>₱18,000,000</Text>
            <Text style={styles.appraisalTableCell}>60</Text>
          </View>
        </View>

        <Text style={styles.appraisalSubheader}>3. Government Valuations</Text>
        <Text style={styles.appraisalText}>
          {appraisalData.market_data.government_values}
        </Text>

        <View style={styles.appraisalHighlight}>
          <Text style={styles.appraisalTextBold}>Government Valuation Metrics:</Text>
          <Text style={styles.appraisalBullet}>• BIR Zonal Value: ₱12,000 per sqm</Text>
          <Text style={styles.appraisalBullet}>• Total Zonal Value (150 sqm): ₱1,800,000</Text>
          <Text style={styles.appraisalBullet}>• Local Government Assessment: ₱1,800,000</Text>
          <Text style={styles.appraisalBullet}>• Market Value Premium: Approximately 11x government valuation</Text>
        </View>

        <Text style={styles.appraisalSubheader}>4. Rental Income Potential</Text>
        <Text style={styles.appraisalText}>
          The rental potential for this property is significant, given its premium location,
          excellent condition, and high-end features. Based on current market rates for
          similar properties in Lahug, we project the following rental metrics:
        </Text>

        <View style={styles.appraisalTable}>
          <View style={styles.appraisalTableHeader}>
            <Text style={[styles.appraisalTableHeaderCell, { flex: 2 }]}>Rental Metric</Text>
            <Text style={styles.appraisalTableHeaderCell}>Value</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Monthly Rental Income</Text>
            <Text style={styles.appraisalTableCell}>{formatCurrency(appraisalData.rental_income_potential.monthly_rental_income)}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Annual Rental Income</Text>
            <Text style={styles.appraisalTableCell}>{formatCurrency(appraisalData.rental_income_potential.monthly_rental_income * 12)}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Expected Occupancy Rate</Text>
            <Text style={styles.appraisalTableCell}>{appraisalData.rental_income_potential.occupancy_rates}%</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Effective Annual Income</Text>
            <Text style={styles.appraisalTableCell}>{formatCurrency(appraisalData.rental_income_potential.monthly_rental_income * 12 * (appraisalData.rental_income_potential.occupancy_rates / 100))}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Gross Rental Yield</Text>
            <Text style={styles.appraisalTableCell}>{((appraisalData.rental_income_potential.monthly_rental_income * 12) / parseFloat(appraisalData.valuation_process.aggregate_valuation.replace(/[^\d.-]/g, '')) * 100).toFixed(2)}%</Text>
          </View>
        </View>

        <Text style={styles.appraisalNote}>
          Note: Rental rates in this area have shown steady growth of 5-7% annually over the past three years, indicating strong potential for future income growth.
        </Text>

        <Text style={styles.appraisalPageNumber}>3</Text>
      </Page>

      {/* Location Analysis Page */}
      <Page size="A4" style={styles.page}>
        {/* Header with branding */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              src="/images/filipino-world-logo.png"
              style={styles.logo}
            />
            <View>
              <Text style={styles.companyName}>Filipino World</Text>
              <Text style={styles.debmac}>DEBMAC</Text>
            </View>
          </View>
        </View>

        <Text style={styles.appraisalHeader}>LOCATION ANALYSIS & FINAL VALUATION</Text>

        <Text style={styles.appraisalText}>
          Location is one of the most significant factors affecting property value. This section provides
          a comprehensive analysis of the property&apos;s location advantages, proximity to essential
          amenities, and how these factors contribute to its overall market value.
        </Text>

        <Text style={styles.appraisalSubheader}>1. Proximity to Key Locations</Text>
        <Text style={styles.appraisalText}>
          {appraisalData.proximity_data.nearest_locations}
        </Text>

        <View style={styles.appraisalTable}>
          <View style={styles.appraisalTableHeader}>
            <Text style={[styles.appraisalTableHeaderCell, { flex: 2 }]}>Landmark</Text>
            <Text style={styles.appraisalTableHeaderCell}>Approximate Distance</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>JY Square Mall</Text>
            <Text style={styles.appraisalTableCell}>0.5 km</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>32 Sanson by Rockwell</Text>
            <Text style={styles.appraisalTableCell}>0.8 km</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Mivesa Garden Residences</Text>
            <Text style={styles.appraisalTableCell}>1.0 km</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Cebu IT Park</Text>
            <Text style={styles.appraisalTableCell}>2.5 km</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Cebu Business Park</Text>
            <Text style={styles.appraisalTableCell}>3.2 km</Text>
          </View>
        </View>

        <Text style={styles.appraisalSubheader}>2. Community & Cultural Environment</Text>
        <Text style={styles.appraisalText}>
          {appraisalData.proximity_data.festivals_events}
        </Text>

        <View style={styles.appraisalHighlight}>
          <Text style={styles.appraisalTextBold}>Cultural & Community Highlights:</Text>
          <Text style={styles.appraisalBullet}>• Sinulog Festival - Annual cultural and religious festival in January</Text>
          <Text style={styles.appraisalBullet}>• Strong sense of community in the Lahug neighborhood</Text>
          <Text style={styles.appraisalBullet}>• Access to local markets and authentic Filipino cuisine</Text>
          <Text style={styles.appraisalBullet}>• Proximity to international schools and universities</Text>
          <Text style={styles.appraisalBullet}>• Growing expatriate community</Text>
        </View>

        <Text style={styles.appraisalSubheader}>3. Investment Potential Analysis</Text>
        <Text style={styles.appraisalText}>
          The property represents an excellent investment opportunity due to several factors:
        </Text>

        <View style={styles.appraisalTable}>
          <View style={styles.appraisalTableHeader}>
            <Text style={[styles.appraisalTableHeaderCell, { flex: 2 }]}>Investment Factor</Text>
            <Text style={styles.appraisalTableHeaderCell}>Assessment</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Capital Appreciation Potential</Text>
            <Text style={styles.appraisalTableCell}>High (8-10% annually)</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Rental Yield</Text>
            <Text style={styles.appraisalTableCell}>4.8% (above market average)</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Market Demand</Text>
            <Text style={styles.appraisalTableCell}>Strong and Consistent</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Liquidity</Text>
            <Text style={styles.appraisalTableCell}>Medium-High</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Risk Assessment</Text>
            <Text style={styles.appraisalTableCell}>Low</Text>
          </View>
        </View>

        <Text style={styles.appraisalSubheader}>4. Final Valuation</Text>
        <View style={{
          backgroundColor: '#f0fdf4',
          padding: 15,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: '#166534',
          marginVertical: 15,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#166534', marginBottom: 5 }}>
            AGGREGATE VALUATION
          </Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#166534' }}>
            {formatCurrency(appraisalData.valuation_process.aggregate_valuation)}
          </Text>
        </View>

        <View style={styles.appraisalWarning}>
          <Text style={styles.appraisalTextBold}>Important Notes:</Text>
          <Text style={styles.appraisalBullet}>• This appraisal is valid for 90 days from the report date</Text>
          <Text style={styles.appraisalBullet}>• Agent fee: {formatCurrency(appraisalData.valuation_process.agent_fee)} (5% of valuation)</Text>
          <Text style={styles.appraisalBullet}>• The final value may be subject to negotiation</Text>
          <Text style={styles.appraisalBullet}>• Market conditions may affect the actual selling price</Text>
          <Text style={styles.appraisalBullet}>• Premium fixtures and recent renovations contribute significantly to the valuation</Text>
        </View>

        <Text style={styles.appraisalCitation}>
          References: Local Government Zonal Valuations, BIR Tax Declarations, Real Estate Industry Association of the Philippines, Cebu Real Estate Board
        </Text>

        <Text style={styles.appraisalPageNumber}>4</Text>
      </Page>

      {/* Additional Investment Analysis Page */}
      <Page size="A4" style={styles.page}>
        {/* Header with branding */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              src="/images/filipino-world-logo.png"
              style={styles.logo}
            />
            <View>
              <Text style={styles.companyName}>Filipino World</Text>
              <Text style={styles.debmac}>DEBMAC</Text>
            </View>
          </View>
        </View>

        <Text style={styles.appraisalHeader}>INVESTMENT POTENTIAL & SUMMARY</Text>

        <Text style={styles.appraisalSubheader}>Valuation Breakdown</Text>
        <View style={styles.appraisalTable}>
          <View style={styles.appraisalTableHeader}>
            <Text style={[styles.appraisalTableHeaderCell, { flex: 2 }]}>Component</Text>
            <Text style={styles.appraisalTableHeaderCell}>Contribution</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Base Land Value</Text>
            <Text style={styles.appraisalTableCell}>₱1,800,000</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Structural Value</Text>
            <Text style={styles.appraisalTableCell}>₱9,500,000</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Premium Features & Renovations</Text>
            <Text style={styles.appraisalTableCell}>₱3,000,000</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Location Premium</Text>
            <Text style={styles.appraisalTableCell}>₱4,700,000</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Market Adjustment</Text>
            <Text style={styles.appraisalTableCell}>₱950,000</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2, fontWeight: 'bold' }]}>Aggregate Valuation</Text>
            <Text style={[styles.appraisalTableCell, { fontWeight: 'bold' }]}>{formatCurrency(appraisalData.valuation_process.aggregate_valuation)}</Text>
          </View>
        </View>

        <Text style={styles.appraisalSubheader}>Future Value Projection</Text>
        <Text style={styles.appraisalText}>
          Based on historical appreciation rates of 8-10% annually for premium properties in this area,
          we project the following value increases over time:
        </Text>

        <View style={styles.appraisalTable}>
          <View style={styles.appraisalTableHeader}>
            <Text style={styles.appraisalTableHeaderCell}>Time Horizon</Text>
            <Text style={styles.appraisalTableHeaderCell}>Projected Value (8% growth)</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={styles.appraisalTableCell}>Current</Text>
            <Text style={styles.appraisalTableCell}>{formatCurrency(appraisalData.valuation_process.aggregate_valuation)}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={styles.appraisalTableCell}>1 Year</Text>
            <Text style={styles.appraisalTableCell}>{formatCurrency(parseFloat(appraisalData.valuation_process.aggregate_valuation.replace(/[^\d.-]/g, '')) * 1.08)}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={styles.appraisalTableCell}>3 Years</Text>
            <Text style={styles.appraisalTableCell}>{formatCurrency(parseFloat(appraisalData.valuation_process.aggregate_valuation.replace(/[^\d.-]/g, '')) * Math.pow(1.08, 3))}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={styles.appraisalTableCell}>5 Years</Text>
            <Text style={styles.appraisalTableCell}>{formatCurrency(parseFloat(appraisalData.valuation_process.aggregate_valuation.replace(/[^\d.-]/g, '')) * Math.pow(1.08, 5))}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={styles.appraisalTableCell}>10 Years</Text>
            <Text style={styles.appraisalTableCell}>{formatCurrency(parseFloat(appraisalData.valuation_process.aggregate_valuation.replace(/[^\d.-]/g, '')) * Math.pow(1.08, 10))}</Text>
          </View>
        </View>

        <Text style={styles.appraisalSubheader}>Final Recommendation</Text>
        <View style={styles.appraisalHighlight}>
          <Text style={styles.appraisalTextBold}>Professional Assessment:</Text>
          <Text style={styles.appraisalText}>
            This property represents an exceptional investment opportunity with a fair market value of {formatCurrency(appraisalData.valuation_process.aggregate_valuation)}.
            The location, quality of construction, premium features, and strong rental potential all contribute to both immediate
            value and long-term appreciation prospects. We recommend proceeding with the sale at the appraised value.
          </Text>
        </View>

        <Text style={styles.footer}>
          Prepared by: Filipino World Real Estate Appraisal Division
          {' | '}Report ID: FW-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
          {' | '}Valuation Date: {new Date().toLocaleDateString()}
        </Text>

        <Text style={styles.appraisalPageNumber}>5</Text>
      </Page>
    </Document>
  );
}
