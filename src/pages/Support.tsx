import { PizzaDonation } from '../components/PizzaDonation';
import { useTranslation } from 'react-i18next';

export default function Support() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-base-950">
      <PizzaDonation />
    </main>
  );
}
