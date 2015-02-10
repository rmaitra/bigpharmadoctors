class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :signed_in_user, only: [:edit, :update, :posts_index]
  
  
  # GET /posts
  # GET /posts.json
  def index
      if params.has_key?(:user_id)
        render json: Post.find_all_by_user_id(params[:user_id])
      elsif params.has_key?(:num_posts_for_user)
        render json: Post.where(user_id: params[:num_posts_for_user]).count
      else
        render json: Post.all
      end
  end
  
  def posts_index
      
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
    render json: Post.find(params[:id])
  end

  # GET /posts/new
  def new
    @post = Post.new
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts
  # POST /posts.json
  def create
    #@post = Post.new(post_params)
    #@post.user_id = @current_user.id
    
    @post = current_user.posts.build(post_params)
    
    if @post.save
    	if current_user.admin?
    	  redirect_to posts_index_path
    	else
    	  redirect_to profile_path(current_user.id)
    	end
        #format.json { render action: 'show', status: :created, location: @post }
      else
        render action: 'new'
        #format.json { render json: @post.errors, status: :unprocessable_entity }
      end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  def update
    respond_to do |format|
      if @post.update(post_params)
	if @current_user.admin?
	  format.html { redirect_to posts_index_path, notice: 'Post was successfully updated.' }
	else
	  format.html { redirect_to profile_path(current_user.id), notice: 'Post was successfully updated.' }
	end
        #format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        #format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    @post = Post.find(params[:id])
    @post.destroy
    respond_to do |format|
      format.html { redirect_to posts_index_path }
      format.json { render :nothing => true, :status => :ok }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_params
      params.require(:post).permit(:title, :content)
    end
    
    def signed_in_user
      redirect_to signin_url, notice: "Please sign in." unless signed_in?
    end
end
