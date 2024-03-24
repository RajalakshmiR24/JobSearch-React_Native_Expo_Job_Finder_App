import { useRoute } from '@react-navigation/native'; // Import useRoute from React Navigation
import { Stack, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";

const tabs = ["About", "Qualifications", "Responsibilities"];

const JobDetails = () => {
  const route = useRoute(); // Access the route object
  const { id } = route.params; // Extract the 'id' parameter from the route params

  const router = useRouter();

  const { data, isLoading, error, refetch } = useFetch("job-details", {
    job_id: id, // Use the 'id' parameter in the useFetch call
  });

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false)); // Reset refreshing state after refresh
  }, [refetch]);

  const displayTabContent = () => {
    if (data && data.length > 0 && data[0]) {
      switch (activeTab) {
        case "Qualifications":
          return (
            <Specifics
              title="Qualifications"
              points={data[0].job_highlights?.Qualifications ?? ["N/A"]} />
          );

        case "About":
          return (
            <JobAbout info={data[0].job_description ?? "No data provided"} />
          );

        case "Responsibilities":
          return (
            <Specifics
              title="Responsibilities"
              points={data[0].job_highlights?.Responsibilities ?? ["N/A"]}
            />
          );

        default:
          return null;
      }
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
          ),
          headerTitle: ''
        }}
      />

      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something went wrong</Text>
          ) : !data || data.length === 0 ? ( // Handle when data is not yet available
            <Text>No data available</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={data[0].employer_logo}
                jobTitle={data[0].job_title}
                companyName={data[0].employer_name}
                location={data[0].job_country}
              />

              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
            </View>
          )}
        </ScrollView>

        {data && data[0] && ( // Check if data exists before accessing its properties
          <JobFooter
            url={
              data[0]?.job_google_link ??
              "https://careers.google.com/jobs/results/"
            }
          />
        )}
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
