import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { ProjectData } from "@/types/project";

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
  projectData: ProjectData;
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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
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
          <Text style={styles.subtitle}>Property Appraisal Report</Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.infoText}>
            Location: {projectData.location.city}, {projectData.location.country}
          </Text>
          <Text style={styles.infoText}>
            Coordinates: {projectData.location.latitude}, {projectData.location.longitude}
          </Text>
          <Text style={styles.infoText}>
            Report Date: {new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={{ marginTop: 40, marginBottom: 20 }}>
          <Text style={[styles.appraisalText, { textAlign: 'center' }]}>
            This comprehensive property appraisal has been conducted in accordance with
            international real estate valuation standards and local market conditions.
          </Text>
        </View>

        <View style={styles.appraisalFigure}>
          <Text style={styles.appraisalFigureCaption}>
            Estimated Market Value: {formatCurrency(parseFloat(appraisalData.valuation_process.aggregate_valuation))}
          </Text>
        </View>

        <Text style={styles.footer}>
          Last Updated: {projectData.last_updated
            ? new Date(projectData.last_updated).toLocaleDateString()
            : "Not available"}
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

        <Text style={styles.appraisalHeader}>Executive Summary</Text>

        <Text style={styles.appraisalText}>
          This report presents a comprehensive property appraisal for {projectData.project_name}
          located in {projectData.location.city}, {projectData.location.country}. The appraisal
          employs a multi-criteria evaluation framework based on established real estate valuation
          methodologies and current market conditions.
        </Text>

        <View style={styles.appraisalHighlight}>
          <Text style={styles.appraisalTextBold}>Key Findings:</Text>
          <Text style={styles.appraisalBullet}>• Purpose of Appraisal: {appraisalData.purpose_of_appraisal}</Text>
          <Text style={styles.appraisalBullet}>• Base Valuation: {appraisalData.valuation_process.base_valuation}</Text>
          <Text style={styles.appraisalBullet}>• Market Comparison: {appraisalData.valuation_process.market_comparison}</Text>
          <Text style={styles.appraisalBullet}>• Agent Fee: {formatCurrency(appraisalData.valuation_process.agent_fee)}</Text>
        </View>

        <Text style={styles.appraisalSubheader}>Valuation Methodology</Text>
        <Text style={styles.appraisalText}>
          The property appraisal follows a comprehensive approach that integrates multiple valuation
          methods to ensure accuracy and reliability:
        </Text>

        <View style={styles.appraisalTable}>
          <View style={styles.appraisalTableHeader}>
            <Text style={[styles.appraisalTableHeaderCell, { flex: 2 }]}>Valuation Component</Text>
            <Text style={styles.appraisalTableHeaderCell}>Description</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Base Valuation</Text>
            <Text style={styles.appraisalTableCell}>{appraisalData.valuation_process.base_valuation}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Adjustment Factors</Text>
            <Text style={styles.appraisalTableCell}>{appraisalData.valuation_process.adjustment_factors}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Market Comparison</Text>
            <Text style={styles.appraisalTableCell}>{appraisalData.valuation_process.market_comparison}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={[styles.appraisalTableCell, { flex: 2 }]}>Rental Income Valuation</Text>
            <Text style={styles.appraisalTableCell}>{appraisalData.valuation_process.rental_income_valuation}</Text>
          </View>
        </View>

        <Text style={styles.appraisalNote}>
          Note: This appraisal follows the International Valuation Standards (IVS) and incorporates
          local market conditions and regulatory requirements.
        </Text>

        <Text style={styles.appraisalCitation}>
          References: International Valuation Standards (IVS), Philippine Real Estate Market Reports
        </Text>

        <Text style={styles.appraisalPageNumber}>1</Text>
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

        <Text style={styles.appraisalHeader}>Market Analysis</Text>

        <Text style={styles.appraisalSubheader}>1. Comparable Sales Analysis</Text>
        <Text style={styles.appraisalText}>
          {appraisalData.market_data.comparable_sales}
        </Text>

        <Text style={styles.appraisalSubheader}>2. Active Listings</Text>
        <Text style={styles.appraisalText}>
          {appraisalData.market_data.active_listings}
        </Text>

        <Text style={styles.appraisalSubheader}>3. Government Values</Text>
        <Text style={styles.appraisalText}>
          {appraisalData.market_data.government_values}
        </Text>

        <Text style={styles.appraisalSubheader}>4. Rental Income Potential</Text>
        <View style={styles.appraisalTable}>
          <View style={styles.appraisalTableHeader}>
            <Text style={styles.appraisalTableHeaderCell}>Metric</Text>
            <Text style={styles.appraisalTableHeaderCell}>Value</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={styles.appraisalTableCell}>Monthly Rental Income</Text>
            <Text style={styles.appraisalTableCell}>{formatCurrency(appraisalData.rental_income_potential.monthly_rental_income)}</Text>
          </View>

          <View style={styles.appraisalTableRow}>
            <Text style={styles.appraisalTableCell}>Occupancy Rate</Text>
            <Text style={styles.appraisalTableCell}>{appraisalData.rental_income_potential.occupancy_rates}%</Text>
          </View>
        </View>

        <Text style={styles.appraisalPageNumber}>2</Text>
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

        <Text style={styles.appraisalHeader}>Location Analysis</Text>

        <Text style={styles.appraisalSubheader}>1. Proximity to Key Locations</Text>
        <Text style={styles.appraisalText}>
          {appraisalData.proximity_data.nearest_locations}
        </Text>

        <Text style={styles.appraisalSubheader}>2. Local Events and Festivals</Text>
        <Text style={styles.appraisalText}>
          {appraisalData.proximity_data.festivals_events}
        </Text>

        <Text style={styles.appraisalSubheader}>3. Final Valuation</Text>
        <View style={styles.appraisalHighlight}>
          <Text style={styles.appraisalTextBold}>Estimated Market Value:</Text>
          <Text style={[styles.appraisalText, { fontSize: 16, fontWeight: 'bold', color: '#166534' }]}>
            {formatCurrency(parseFloat(appraisalData.valuation_process.aggregate_valuation))}
          </Text>
          <Text style={styles.appraisalText}>
            This valuation includes all adjustment factors, market comparisons, and income potential considerations.
          </Text>
        </View>

        <View style={styles.appraisalWarning}>
          <Text style={styles.appraisalTextBold}>Important Notes:</Text>
          <Text style={styles.appraisalBullet}>• This appraisal is valid for 90 days from the report date</Text>
          <Text style={styles.appraisalBullet}>• The final value may be subject to negotiation</Text>
          <Text style={styles.appraisalBullet}>• Market conditions may affect the actual selling price</Text>
        </View>

        <Text style={styles.appraisalCitation}>
          References: Local Government Zonal Valuations, BIR Tax Declarations
        </Text>

        <Text style={styles.appraisalPageNumber}>3</Text>
      </Page>
    </Document>
  );
}
