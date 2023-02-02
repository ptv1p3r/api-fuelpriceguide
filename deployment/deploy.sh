
# syntax to run the script:
# ./deploy.sh arg1 arg2
# arg1: environment (dev | qa | prod)
# arg2: parameters file

########## Script Parameters ##########
S3BUCKET="vipernet-$1-deployments"
ARTIFACTS_PATH="artifacts/api/fuelpriceguide-api"
SWAGGER_FILE="fuelpriceguideApi-swagger.yaml"

SWAGGERS3BUCKET="vipernet-$1-online-documentation"

INPUT_TEMPLATE="fuelpriceguide-api-cloudformation.yaml"
OUTPUT_TEMPLATE="packaged-cloudformation.yaml"
STACK_NAME="vipernet-$1-fuelpriceguide-api"
#####################################################


######### Argument Validation #########
if [ "$#" -ne 2 ]; then
    echo ""
    echo "Error: Illegal number of parameters"
    echo ""
    exit 1
fi

#######################################

echo ""
echo "----------------------------------"
echo "------------ STEP 1/4 ------------"
echo "----------------------------------"
echo ""
echo "Uploading artifacts to S3:"

echo "aws s3 cp ./${SWAGGER_FILE} s3://${S3BUCKET}/${ARTIFACTS_PATH}/${SWAGGER_FILE}"
echo ""
echo "--> STEP 1/4 RESULTS:"

aws --profile $1 s3 cp ./${SWAGGER_FILE} s3://${S3BUCKET}/${ARTIFACTS_PATH}/${SWAGGER_FILE}

#####################################################

echo ""
echo "----------------------------------"
echo "------------ STEP 2/4 ------------"
echo "----------------------------------"
echo ""
echo "Uploading swagger to S3 (documentation):"

echo "aws s3 cp ./${SWAGGER_FILE} s3://${SWAGGERS3BUCKET}/${SWAGGER_FILE}"
echo ""
echo "--> STEP 2/4 RESULTS:"

aws --profile $1 s3 cp ./${SWAGGER_FILE} s3://${SWAGGERS3BUCKET}/${SWAGGER_FILE}

#####################################################

echo ""
echo "----------------------------------"
echo "------------ STEP 3/4 ------------"
echo "----------------------------------"
echo ""
echo "Running AWS Cloudformation package:"

echo "aws --profile $1 cloudformation package"
echo "   --template-file ${INPUT_TEMPLATE}"
echo "   --output-template-file ${OUTPUT_TEMPLATE}"
echo "   --s3-bucket ${S3BUCKET}"
echo "   --profile $1"

echo ""
echo "--> STEP 3/4 RESULTS:"

aws --profile $1 cloudformation package \
   --template-file $INPUT_TEMPLATE \
   --output-template-file $OUTPUT_TEMPLATE \
   --s3-bucket $S3BUCKET \

#####################################################

echo ""
echo "----------------------------------"
echo "------------ STEP 4/4 ------------"
echo "----------------------------------"
echo ""
echo "Running aws cloudformation deploy:"

echo "aws --profile $1 cloudformation deploy"
echo "   --template-file ${OUTPUT_TEMPLATE}"
echo "   --parameter-overrides $(cat $2)"
echo "   --stack-name ${STACK_NAME}"
echo "   --capabilities CAPABILITY_IAM"


echo ""
echo "--> STEP 4/4 RESULTS:"

aws --profile $1 cloudformation deploy \
   --template-file $OUTPUT_TEMPLATE \
   --parameter-overrides $(cat $2) \
   --stack-name ${STACK_NAME} \
   --capabilities CAPABILITY_IAM
