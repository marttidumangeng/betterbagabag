import { useMemo } from 'react';

import { Coins, Landmark, Wallet } from 'lucide-react';

import { StatGrid } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { DetailSection } from '@/components/layout/PageLayouts';
import { PageHero } from '@/components/layout/PageLayouts';

import FinancialPieChart from '@/pages/transparency/components/FinancialPieChart';

import { formatPesoAdaptive } from '@/lib/format';

import ariData from '@/data/statistics/ari.json';

const COLORS = {
  national: '#0066eb',
  local: '#cc3e00',
  special: '#059669',
  other: '#64748b',
};

const MILLION = 1_000_000;

function pctLabel(part: number, whole: number): string {
  if (!whole || whole <= 0) return 'Not yet listed';
  return `${((part / whole) * 100).toFixed(1)}%`;
}

export default function MunicipalIncomePage() {
  const data = ariData[0];

  const drillDownIncomeData = useMemo(() => {
    if (!data) return [];
    return [
      {
        name: 'National Tax Allotment',
        value: data.other_income_sources.national_tax_allotment * MILLION,
        color: COLORS.national,
      },
      {
        name: 'Locally Sourced Revenue',
        value:
          data.locally_sourced_revenue.total_locally_sourced_revenue * MILLION,
        color: COLORS.local,
        details: [
          {
            name: 'Tax Revenue',
            value:
              data.locally_sourced_revenue.tax_revenue.total_tax_revenue *
              MILLION,
          },
          {
            name: 'Non-Tax Revenue',
            value:
              data.locally_sourced_revenue.non_tax_revenue
                .total_non_tax_revenue * MILLION,
          },
        ],
      },
      {
        name: 'Other National Shares',
        value:
          data.other_shares_from_national_tax_collection.total_other_shares *
          MILLION,
        color: COLORS.special,
      },
      {
        name: 'Interest Income',
        value: data.other_income_sources.interest_income * MILLION,
        color: COLORS.other,
      },
    ];
  }, [data]);

  if (!data) {
    return (
      <EmptyState
        title='Municipal Income Data Not Loaded Yet'
        message='Annual Regular Income figures for Bagabag have not been sourced for this portal yet.'
        actionHref='/transparency'
        actionLabel='Open Transparency'
      />
    );
  }

  const ari = data.summary_indicators.annual_regular_income;
  const lsr = data.locally_sourced_revenue.total_locally_sourced_revenue;
  const nta = data.other_income_sources.national_tax_allotment;
  const lsrDependency =
    data.summary_indicators.dependency_rates.lsr_dependency ??
    pctLabel(lsr, ari);
  const ntaDependency =
    data.summary_indicators.dependency_rates.nta_dependency ??
    pctLabel(nta, ari);

  return (
    <>
      <PageHero
        title='Municipal Income'
        description='Detailed analysis of revenue sources, fiscal autonomy, and national tax dependency.'
      >
        <div className='flex flex-wrap justify-center gap-2'>
          <Badge variant='primary' dot>
            {data.period}
          </Badge>
          <Badge variant='slate'>BLGF Data</Badge>
        </div>
      </PageHero>

      <div className='mb-kapwa-lg'>
        <StatGrid
          columns={3}
          stats={[
            {
              label: 'Total Income',
              value: formatPesoAdaptive(ari * MILLION).fullString,
              subtext: 'Annual Revenue',
              variant: 'primary',
            },
            {
              label: 'Local Sufficiency',
              value: `${lsrDependency}`,
              subtext: 'LSR Share',
              variant: 'secondary',
            },
            {
              label: 'NTA Dependency',
              value: `${ntaDependency}`,
              subtext: 'National Allotment',
              variant: 'slate',
              icon: Wallet,
            },
          ]}
        />
      </div>

      <div className='mb-kapwa-lg'>
        <DetailSection title='Revenue Composition' icon={Landmark}>
          <div className='flex justify-center'>
            <FinancialPieChart
              title='Overview'
              icon={Landmark}
              data={drillDownIncomeData}
              colors={[
                COLORS.national,
                COLORS.local,
                COLORS.special,
                COLORS.other,
              ]}
            />
          </div>
        </DetailSection>
      </div>

      <DetailSection title='Full Financial Itemization' icon={Coins}>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='space-y-4'>
            <h4 className='text-kapwa-text-accent-orange border-b pb-2 text-[10px] font-black tracking-widest uppercase'>
              Local Tax
            </h4>
            <div className='text-kapwa-text-support space-y-2 text-sm font-bold'>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Real Property</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.locally_sourced_revenue.tax_revenue
                        .real_property_tax_general_fund * MILLION
                    ).fullString
                  }
                </span>
              </div>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Business Tax</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.locally_sourced_revenue.tax_revenue.tax_on_business *
                        MILLION
                    ).fullString
                  }
                </span>
              </div>
            </div>
          </div>
          <div className='space-y-4'>
            <h4 className='text-kapwa-text-brand border-b pb-2 text-[10px] font-black tracking-widest uppercase'>
              Non-Tax
            </h4>
            <div className='text-kapwa-text-support space-y-2 text-sm font-bold'>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Fees</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.locally_sourced_revenue.non_tax_revenue
                        .regulatory_fees * MILLION
                    ).fullString
                  }
                </span>
              </div>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Enterprises</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.locally_sourced_revenue.non_tax_revenue
                        .receipts_from_economic_enterprises * MILLION
                    ).fullString
                  }
                </span>
              </div>
            </div>
          </div>
          <div className='space-y-4'>
            <h4 className='border-b pb-2 text-[10px] font-black tracking-widest text-kapwa-text-success uppercase'>
              External
            </h4>
            <div className='text-kapwa-text-support space-y-2 text-sm font-bold'>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Allotment</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.other_income_sources.national_tax_allotment *
                        MILLION
                    ).fullString
                  }
                </span>
              </div>
              <div className='bg-kapwa-bg-surface-raised flex justify-between rounded-lg p-2'>
                <span>Other Shares</span>
                <span>
                  {
                    formatPesoAdaptive(
                      data.other_shares_from_national_tax_collection
                        .total_other_shares * MILLION
                    ).fullString
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
        {data.summary_indicators.dependency_rates.notes && (
          <p className='text-kapwa-text-disabled mt-6 text-xs'>
            {data.summary_indicators.dependency_rates.notes}
          </p>
        )}
      </DetailSection>

      <footer className='border-kapwa-border-weak space-y-4 border-t pt-10 text-center'>
        <div className='space-y-1'>
          <p className='text-kapwa-text-strong text-[10px] font-bold tracking-widest uppercase'>
            Sourced ARI summary
          </p>
          <p className='text-kapwa-text-disabled text-[10px] font-bold tracking-widest uppercase'>
            Source:{' '}
            <a
              href='https://talaanph.org/places/nueva-vizcaya/bagabag/'
              target='_blank'
              rel='noreferrer'
              className='hover:text-kapwa-text-brand underline'
            >
              BLGF-derived public summary
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
