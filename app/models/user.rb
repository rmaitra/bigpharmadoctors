class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :registerable, :confirmable

    before_save { self.email = email.downcase }
    before_save :create_remember_token
    
    validates :name, presence: true, length: { maximum: 50 }
    VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    validates :email, presence: true,
                      format: { with: VALID_EMAIL_REGEX },
                      uniqueness: { case_sensitive: false }
    validates :password, length: { minimum: 6 }
    validates :password_confirmation, presence: true
    
    #has_secure_password
    
    #has_many :clients
    has_many :posts
    has_many :molecules, dependent: :destroy
    
    after_initialize :init

    def init
      self.admin ||= false
    end
    
    def as_json(options={})
    {
      :id => id,
      :name => name,
      :email => email,
      :created_at => created_at,
      :updated_at => updated_at
    }
    end
    
    private
    
        def create_remember_token
          self.remember_token = SecureRandom.urlsafe_base64
        end 
end
