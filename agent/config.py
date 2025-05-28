from ibm_watsonx_ai.foundation_models.schema import TextChatParameters
from langchain_ibm import ChatWatsonx
import os
from dotenv import load_dotenv

load_dotenv()

watsonx_apikey = os.getenv("WATSONX_APIKEY")
watsonx_project_id = os.getenv("WATSONX_PROJECT_ID")
watsonx_url = os.getenv("WATSONX_URL")

parameters = TextChatParameters(max_tokens=20, temperature=0.0, top_p=1)

watsonx_llm = ChatWatsonx(
    model_id="meta-llama/llama-3-3-70b-instruct",
    url=watsonx_url,
    apikey=watsonx_apikey,
    project_id=watsonx_project_id,
    params=parameters,
)
