import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { COLORS, icons } from "../../constants";
import { ScreenHeaderBtn } from "../../components";
import useFetch from "../../hook/useFetch";

const JobDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params; // Assuming you're passing id as a route param

  // Fetch job details based on id
  const { data, isLoading, error, refetch } = useFetch("job-details", {
    job_id: id,
  });

  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <View>
        {/* Your job details rendering goes here */}
        <Text>{JSON.stringify(data)}</Text>
      </View>
      <ScreenHeaderBtn
        iconUrl={icons.left}
        dimension="60%"
        handlePress={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
};

export default JobDetails;