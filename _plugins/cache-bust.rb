# based on https://distresssignal.org/busting-css-cache-with-jekyll-md5-hash
# https://gist.github.com/BryanSchuetz/2ee8c115096d7dd98f294362f6a667db
module Jekyll
  module CacheBust
    class CacheDigester
      require 'digest/md5'
      require 'pathname'

      attr_accessor :file_name, :directory

      def initialize(file_name:, directory: nil, source: Dir.pwd, baseurl: '')
        self.file_name = file_name
        self.directory = directory
        @source = source
        @baseurl = baseurl.to_s.sub(%r{/$}, '')
      end

      def digest!
        [file_name, '?', Digest::MD5.hexdigest(file_contents)].join
      end

      private

      def directory_files_content
        Array(directory).flat_map do |entry|
          path = File.join(@source, entry)
          File.directory?(path) ? Dir[File.join(path, '**', '*')] : [path]
        end.select { |path| File.file?(path) }.sort.map { |path| File.binread(path) }.join("\0")
      end

      def file_content
        local_file_name = file_name.split('?').first
        if !@baseurl.empty? && local_file_name.start_with?(@baseurl + '/')
          local_file_name = local_file_name.delete_prefix(@baseurl)
        end
        File.binread(File.join(@source, local_file_name.delete_prefix('/')))
      end

      def file_contents
        is_directory? ? file_content : directory_files_content
      end

      def is_directory?
        directory.nil?
      end
    end

    def bust_file_cache(file_name)
      site = @context.registers[:site]
      CacheDigester.new(file_name: file_name, source: site.source, baseurl: site.config['baseurl']).digest!
    end

    def bust_css_cache(file_name)
      site = @context.registers[:site]
      sass_dir = site.config.fetch('sass', {}).fetch('sass_dir', '_sass')
      CacheDigester.new(
        file_name: file_name,
        source: site.source,
        directory: [sass_dir, 'assets/css', '_config.yml']
      ).digest!
    end
  end
end

Liquid::Template.register_filter(Jekyll::CacheBust)
