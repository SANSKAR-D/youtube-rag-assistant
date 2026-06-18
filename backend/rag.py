import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough,RunnableLambda
from dotenv import load_dotenv

load_dotenv()

CHROMA_DIR = os.getenv("CHROMA_DIR")


embedding_model = OllamaEmbeddings(
    model = os.getenv("OLLAMA_EMBED_MODEL"),
    base_url = os.getenv("OLLAMA_BASE_URL")
)

llm = ChatOllama(
    model = os.getenv("OLLAMA_LLM_MODEL"),
    base_url = os.getenv("OLLAMA_BASE_URL"),
    temperature=0
)

def embed_transcript(video_id:str,text:str)->str:
    """
    Splits the text, embeds it, and 
    saves it in a persistent Chroma DB on disk """

    dir = os.path.join(CHROMA_DIR,video_id)

    if(os.path.exists(dir)):
        return dir

    os.makedirs(dir, exist_ok=True)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = 1000,
        chunk_overlap = 200,
        separators = ["\n\n", "\n", ".", " "]
    )
    chunks = text_splitter.create_documents([text])

    Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory=dir
    )
    return dir

def query_video(video_id:str,query:str)->str:
    """
    Query the vector DB for the given video ID and question
    """
    dir = os.path.join(CHROMA_DIR,video_id)

    vectorstore = Chroma(
        persist_directory=dir,
        embedding_function=embedding_model
    )
    if not os.path.exists(dir):
        raise FileNotFoundError(f"No data found for video {video_id}")
    
    retriever = vectorstore.as_retriever(search_type="mmr",search_kwargs={"k": 4,"lambda_mult": 1})

    prompt = ChatPromptTemplate.from_template("""
    You are an AI assistant helping a user analyze a YouTube video transcript.
    
    Context:
    {context}
    
    Question:
    {question}
    
    Instructions:
    1. Answer the question using ONLY the provided context.
    2. If the context does not contain the answer, say "I cannot find the answer in this video."
    3. IMPORTANT: Regardless of the language of the transcript context (Hindi, Spanish, etc.), you MUST write your final answer entirely in English.
    
    Answer:
    """)

    def format_docs(docs):
        return"\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | RunnableLambda(format_docs), "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    return rag_chain.invoke(query)
