import { Helmet } from 'react-helmet';
import useCustomization from "@/hooks/customization";

const HeadUpdater = () => {
  const { appName } = useCustomization();

  return (
    <Helmet>
      <title>{appName}</title>
    </Helmet>
  );
};

export default HeadUpdater;